/**
 * @file generator
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const fs = require('fs');
const path = require('path');
const hash = require('shorthash');
const transform = require('./transform');
const {CODE_BLOCK_NAME} = require('./constants');
const _ = require('lodash');
const relative = require('require-path-relative');
const {
    findAll,
    getInnerHTML,
    getOuterHTML,
    appendChild
} = require('domutils');

function generateCodeBlock(options) {

    let {
        node,
        originPath,
        targetPath,
        index
    } = options;

    let source = getInnerHTML(node);

    // 对顶级的 script 标签内部做路径调整
    node.children
        .filter(child => (
            child.type === 'script'
            && child.name === 'script'
            && !(child.attribs && child.attribs.src)
        ))
        .forEach(script => {

            let textNode = script.children[0];

            textNode.data = transform.normalizeDependences({
                code: textNode.data,
                targetPath,
                originPath,
                components: []
            });

        });

    let content = getInnerHTML(node);

    let snippetFileName = `${path.basename(originPath)}.snippet-${hash.unique(source)}`;
    let snippetFilePath = path.join(
        path.dirname(targetPath),
        `${snippetFileName}.san`
    );

    fs.writeFileSync(snippetFilePath, content, 'utf8');

    let componentName = _.camelCase(snippetFileName).toLowerCase();

    // 用 snippet 替换掉 code block 的原有内容
    node.children = [];
    appendChild(node, {
        name: componentName,
        type: 'tag',
        attribs: {},
        children: []
    });

    return {
        componentName,
        source: `./${snippetFileName}.san`,
        local: _.capitalize(_.camelCase(snippetFileName)),
        filePath: snippetFilePath,
        mainFilePath: targetPath,
        originPath,
        index
    };

}

function resolveComponents(root) {

    return findAll(
        node => (
            node.type === 'tag'
            && node.name === CODE_BLOCK_NAME
        ),
        root.children
    );

}

function generateScriptByComponents(options) {

    let {
        components,
        targetPath
    } = options;

    if (!components || !components.length) {
        return '';
    }

    let importContent = components.map(component => {

        let {
            source,
            local
        } = component;

        return `import ${local} from '${source}';`;

    }).join('\n');

    let componentContent = components.map(component => {

        let {
            local,
            componentName
        } = component;

        return `'${componentName}': ${local}`;

    }).join(',\n');

    let relativeSanCodeBlockPath = relative(
        path.dirname(targetPath),
        path.join(__dirname, './component/SanCodeBlock.js')
    );

    return `\
${importContent}
import SanCodeBlock from '${relativeSanCodeBlockPath}';
export default {
    components: {
        'san-code-block': SanCodeBlock,
        ${componentContent}
    }
};`;

}

function wrapRoot(ast) {

    let section = {
        type: 'tag',
        name: 'section',
        attribs: {
            'class': 'san-markdown-loader-wrapper'
        },
        children: []
    };

    ast.forEach(node => appendChild(section, node));

    let template = {
        type: 'tag',
        name: 'template',
        children: []
    };

    appendChild(template, section);

    return template;
}

function generate(options) {

    let {
        source,
        ast,
        filePath,
        cacheDir
    } = options;

    let filename = `${path.basename(filePath)}.${hash.unique(source)}.san`;
    let targetFilePath = path.join(cacheDir, filename);
    let template = wrapRoot(ast);
    let components = resolveComponents(template);
    let script;

    if (components && components.length) {
        components = components.map((component, index) => (
            generateCodeBlock({
                node: component,
                originPath: filePath,
                targetPath: targetFilePath,
                index
            })
        ));
        script = generateScriptByComponents({
            components,
            targetPath: targetFilePath,
            originPath: filePath
        });
    }

    let content = `\
${getOuterHTML(template)}
<script>
    ${script}
</script>`;

    fs.writeFileSync(targetFilePath, content.trim(), 'utf8');

    return {
        content,
        filePath: targetFilePath
    };

}

module.exports = {
    generate
};

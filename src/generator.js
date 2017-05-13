/**
 * @file generator
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const fs = require('fs');
const path = require('path');
const parser = require('./parser');
const {serialize} = require('parse5');
const hash = require('shorthash');
const transform = require('./transform');
const {CODE_BLOCK_NAME} = require('./constants');
const _ = require('lodash');
const NAMESPACE = 'http://www.w3.org/1999/xhtml';

function replaceRootNode(root, newRoot) {

    let childNodes = root.childNodes.map(child => (
        Object.assign(
            {},
            child,
            {
                parentNode: newRoot
            }
        )
    ));

    let result = Object.assign(
        {},
        root,
        newRoot,
        {
            childNodes
        }
    );

    if (result.parentNode && result.parentNode.childNodes) {
        result.parentNode.childNodes = result.parentNode.childNodes.map(child => (
            child === root ? result : child
        ));
    }

    return result;

}

/**
 * 合并 style 标签
 *
 * 这里要注意给 style 的 childNodes 中的所有 #text 结点设置 parentNode；
 * serialize 会根据 parentNode 来判断要不要做 html escape；
 *
 * @param  {Array<Node>} styles 标签 AST 结点
 * @return {Node}
 */
function combineStyles(styles) {

    let combinedStyle = {
        nodeName: 'style',
        tagName: 'style',
        attrs: [],
        childNodes: []
    };

    let child = {
        nodeName: '#text',
        value: styles.map(style => style.childNodes[0].value).join('\n'),
        parentNode: combinedStyle
    };

    combinedStyle.childNodes.push(child);

    return combinedStyle;

}

function replaceSanCodeBlock(ast, components) {

    let codeBlockIndex = 0;

    parser.traverse(ast, {
        [CODE_BLOCK_NAME](node, parent, path, index) {

            let componentName = components[codeBlockIndex++].componentName;

            node.childNodes = [
                {
                    nodeName: componentName,
                    tagName: componentName,
                    attrs: [],
                    namespaceURI: NAMESPACE
                }
            ];

        }
    });

}

/**
 * 使用 parts 生成代码
 *
 * @param  {Node}    template          模板数据
 * @param  {Object}  script            脚本
 * @param  {Node}    style             样式
 * @return {string}
 */
function generateByParts(template, script, style) {

    let {content, components} = script;

    if (components.length) {
        replaceSanCodeBlock(template, components);
    }

    let root = {
        nodeName: '#document-fragment',
        childNodes: [
            template,
            {
                nodeName: '#text',
                value: '\n'
            },
            {
                tagName: 'script',
                nodeName: 'script',
                namespaceURI: NAMESPACE,
                attrs: [],
                childNodes: [
                    {
                        nodeName: '#text',
                        value: '\n'
                    },
                    {
                        nodeName: '#text',
                        value: content
                    },
                    {
                        nodeName: '#text',
                        value: '\n'
                    }
                ]
            },
            {
                nodeName: '#text',
                value: '\n'
            },
            style
        ]
    };

    return serialize(root);

}

function generateCodeBlock(options) {

    let {
        node,
        originPath,
        targetPath,
        index
    } = options;

    let source = serialize(node);

    let mockRoot = replaceRootNode(node, {
        nodeName: '#document-fragment'
    });

    let parts = parser.getParts(mockRoot);

    let {
        template,
        script,
        style
    } = parts;

    let allScripts = transform.normalizeDependences({
        code: script.map(s => serialize(s)).join(''),
        targetPath,
        originPath,
        components: []
    });

    let content = generateByParts(
        template[0],
        {
            content: allScripts,
            components: []
        },
        combineStyles(style)
    );

    let snippetFileName = `${path.basename(originPath)}.snippet-${hash.unique(source)}`;
    let snippetFilePath = path.join(
        path.dirname(targetPath),
        `${snippetFileName}.san`
    );

    fs.writeFileSync(snippetFilePath, content, 'utf8');

    return {
        componentName: _.camelCase(snippetFileName).toLowerCase(),
        source: `./${snippetFileName}.san`,
        local: _.capitalize(_.camelCase(snippetFileName)),
        filePath: snippetFilePath,
        mainFilePath: targetPath,
        originPath,
        index
    };

}

function generate(options) {

    let {
        source,
        parts,
        filePath,
        cacheDir
    } = options;

    let filename = `${path.basename(filePath)}.${hash.unique(source)}.san`;
    let targetFilePath = path.join(cacheDir, filename);

    let {
        template,
        style,
        script,
        components
    } = parts;

    if (components && components.length) {
        components = components.map((component, index) => (
            generateCodeBlock({
                node: component,
                originPath: filePath,
                targetPath: targetFilePath,
                index
            })
        ));
    }

    let allScripts = transform.normalizeDependences({
        code: script.map(s => serialize(s)).join('\n'),
        targetPath: targetFilePath,
        originPath: filePath,
        components
    });

    let content = generateByParts(
        template[0],
        {
            content: allScripts,
            components
        },
        combineStyles(style)
    );

    fs.writeFileSync(targetFilePath, content, 'utf8');

    return {
        content,
        filePath: targetFilePath
    };

}

module.exports = {
    generate,
    generateCodeBlock
};

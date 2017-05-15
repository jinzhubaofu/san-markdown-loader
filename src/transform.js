/**
 * @file transform
 * @author leon<ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const gen = require('babel-generator').default;
const relative = require('require-path-relative');

function normalizeDependences(options) {

    let {code, targetPath, originPath} = options;

    let ast = babylon.parse(code, {
        sourceType: 'module'
    });

    traverse(ast, {
        ImportDeclaration: {
            enter({node}) {
                // 将 cache 文件中的依赖路径调整正确
                let source = node.source;
                if (/^\./.test(source.value)) {
                    let absolutePath = path.join(
                        path.dirname(originPath),
                        source.value
                    );
                    let newRelativePath = relative(
                        path.dirname(targetPath),
                        absolutePath
                    );
                    source.value = newRelativePath;
                }
            }
        }
    });

    let result = gen(
        ast,
        {
            retainLines: false,
            compact: 'auto',
            concise: false,
            quotes: 'single'
        },
        code
    );

    return result.code;

}

module.exports = {
    normalizeDependences
};

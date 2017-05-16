/**
 * @file transform
 * @author leon<ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const gen = require('babel-generator').default;
const util = require('./util');

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
                if (util.isRelativeModulePath(source.value)) {
                    source.value = util.translateModulePath(
                        source.value,
                        originPath,
                        targetPath
                    );
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

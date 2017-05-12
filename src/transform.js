/**
 * @file transform
 * @author leon<ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');
const gen = require('babel-generator').default;
const relative = require('require-path-relative');

exports.normalizeDependences = function (options) {

    let {code, targetPath, originPath, components} = options;

    let ast = babylon.parse(code, {
        sourceType: 'module'
    });

    let hasExportDefaultExpression = false;

    traverse(ast, {

        Program: {
            exit({node}) {

                // 添加 snippet 依赖
                if (components.length) {
                    node.body = [
                        ...node.body,
                        t.importDeclaration(
                            [
                                t.importDefaultSpecifier(t.identifier('SanCodeBlock'))
                            ],
                            t.stringLiteral(
                                relative(
                                    path.dirname(targetPath),
                                    path.join(__dirname, './component/SanCodeBlock')
                                )
                            )
                        ),
                        ...components.map(({local, source}) => (
                            t.importDeclaration(
                                [
                                    t.importDefaultSpecifier(t.identifier(local))
                                ],
                                t.stringLiteral(source)
                            )
                        ))
                    ];
                }

                // 添加 default export
                if (!hasExportDefaultExpression) {

                    let allComponentDependences = components.map(c => (
                        t.objectProperty(
                            t.stringLiteral(c.componentName),
                            t.identifier(c.local)
                        )
                    ));

                    if (components.length) {
                        allComponentDependences.push(t.objectProperty(
                            t.stringLiteral('san-code-block'),
                            t.identifier('SanCodeBlock')
                        ));
                    }

                    node.body = [
                        t.importDeclaration(
                            [
                                t.importDefaultSpecifier(t.identifier('san'))
                            ],
                            t.stringLiteral('san')
                        ),
                        ...node.body,
                        t.exportDefaultDeclaration(
                            t.objectExpression([
                                t.objectProperty(
                                    t.identifier('components'),
                                    t.objectExpression(allComponentDependences)
                                )
                            ])
                        )
                    ];
                }

            }
        },

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
        },

        ExportDefaultDeclaration: {
            enter({node}) {

                hasExportDefaultExpression = true;

                // 将 components 添加到 components 中
                let declaration = node.declaration;

                switch (declaration.type) {
                    case 'ObjectExpression':
                        let properties = declaration.properties;
                        let componentsProperty = properties.find(
                            property => (
                                property.key.name === 'components'
                                || property.key.value === 'components'
                            )
                        );

                        if (!componentsProperty) {
                            componentsProperty = t.objectProperty(
                                t.stringLiteral('components'),
                                t.objectExpression([])
                            );
                            properties.push(componentsProperty);
                        }

                        if (components.length) {
                            componentsProperty.value.properties = [
                                ...componentsProperty.value.properties,
                                t.objectProperty(
                                    t.stringLiteral('san-code-block'),
                                    t.identifier('SanCodeBlock')
                                ),
                                ...components.map(({componentName, local}) => (
                                    t.objectProperty(
                                        t.stringLiteral(componentName),
                                        t.identifier(local)
                                    )
                                ))
                            ];
                        }

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

};

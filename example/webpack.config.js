/**
 * @file webpack configuration
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            'san-markdown-loader': path.resolve(__dirname, '../')
        }
    },
    plugins: [
        new webpack.WatchIgnorePlugin([
            /\.cache/
        ])
    ],
    module: {
        rules: [
            {
                test: /\.san$/,
                loader: 'san-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: path.resolve(__dirname, '../src/index.js'),
                        options: {
                            use: [function (md) {
                                let renderer = md.renderer;
                                let renderAttrs = renderer.renderAttrs;

                                md.renderer.renderAttrs = function (token) {

                                    if (token.nesting === -1) {
                                        return '';
                                    }

                                    let attrs = token.attrs;

                                    if (!attrs) {
                                        attrs = token.attrs = [];
                                    }

                                    let hasClassName = false;
                                    for (let i = 0, len = attrs.length; i < len; i++) {
                                        if (attrs[i][0] === 'class') {
                                            attrs[i][1] += ' ' + 'heihei';
                                            hasClassName = true;
                                            break;
                                        }
                                    }


                                    if (!hasClassName) {
                                        attrs.push(['class', 'heihei']);
                                    }

                                    return renderAttrs.call(renderer, token);

                                };
                            }]
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    },
    devServer: {
        port: 8888,
        historyApiFallback: true,
        noInfo: false,
        watchOptions: {
            ignored: path.resolve(__dirname, '../_cache')
        }
    },
    devtool: 'source-map'
};

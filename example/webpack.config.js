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
                        loader: 'babel-loader'
                    },
                    {
                        loader: path.resolve(__dirname, '../src/index.js')
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

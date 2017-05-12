/**
 * @file build.js
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const webpack = require('webpack');
const config = require('../example/webpack.config');

webpack(config, (err, stats) => {

    if (err || stats.hasErrors()) {
        console.error(err || stats.toString());
    }

    console.log('done');

});

/**
 * @file san-markdown-loader
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-camelcase, prefer-rest-params, fecs-prefer-destructure, fecs-no-require */

const loaderUtils = require('loader-utils');
const generator = require('./generator');
const markdown = require('./markdown');
const path = require('path');
const parser = require('./parser');

module.exports = function (source) {

    let options = Object.assign(
        loaderUtils.getOptions(this) || {},
        this.sanMarkdown,
        this.options.sanMarkdown
    );

    let code = markdown(options).render(source);
    let parts = parser.parse(code);

    let {filePath} = generator.generate({
        source,
        code,
        parts,
        filePath: this.resourcePath,
        cacheDir: path.join(__dirname, '../.cache')
    });

    let moduleName = loaderUtils.stringifyRequest(this, filePath).slice(1, -1);

    return `module.exports = require('!!san-loader!${moduleName}');`;

};

/**
 * @file parser
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require, fecs-prefer-destructure */

const {Parser, DomHandler} = require('htmlparser2');

function parse(code) {
    return new Promise((resolve, reject) => {

        let parseHandler = new DomHandler(function (error, dom) {

            if (error) {
                reject(error);
                return;
            }

            resolve(dom);

        }, {
            normalizeWhitespace: false
        });

        let parser = new Parser(
            parseHandler,
            {
                // 保留属性名的大小写
                lowerCaseAttributeNames: false,
                // 打开自定义标签的自闭合
                recognizeSelfClosing: true
            }
        );

        parser.write(code);
        parser.end();

    });
}

module.exports = {
    parse
};

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
                lowerCaseAttributeNames: false
            }
        );

        parser.write(code);
        parser.end();

    });
}

module.exports = {
    parse
};

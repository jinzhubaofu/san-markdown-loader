/**
 * @file 小工具
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const relative = require('require-path-relative');
const path = require('path');
const {getInnerHTML, getOuterHTML, getText} = require('./stringify');

function translateModulePath(currentModulePath, originPath, targetPath) {

    let exclamationIndex = currentModulePath.lastIndexOf('!');
    let loaderString = currentModulePath.slice(0, exclamationIndex + 1);
    let modulePath = currentModulePath.slice(exclamationIndex + 1);
    let absolutePath = path.resolve(path.dirname(originPath), modulePath);
    let newModulePath = relative(path.dirname(targetPath), absolutePath);

    return `${loaderString}${newModulePath}`;

}

function isRelativeModulePath(modulePath) {
    let exclamationIndex = modulePath.lastIndexOf('!');
    let result = modulePath.charAt(exclamationIndex + 1) === '.';
    return result;
}

module.exports = {
    translateModulePath,
    isRelativeModulePath,
    getInnerHTML,
    getOuterHTML,
    getText
};

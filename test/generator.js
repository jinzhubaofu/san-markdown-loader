/**
 * @file generator
 * @author leon <ludafa@outlook.com>
 */

const {parseFragment, serialize} = require('parse5');

const source = '<template><h2>aaaa</h2></template>';

let ast = parseFragment(source);
console.log(ast);
console.log(serialize(ast));

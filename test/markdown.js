/**
 * @file MarkdownIt
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const markdownIt = require('markdown-it');
// const markdownItFence = require('markdown-it-fence');
const markdownItFence = require('../src/markdown-it-plugin/fence');
const fs = require('fs');
const path = require('path');

let md = markdownIt()
    .use(md => markdownItFence(md, 'san-code-block', {
        validate(params) {
            return params.trim().split(' ')[0] === 'san';
        },
        render(tokens, index, options, env, self) {
            // return 'heihei';
            let {info, content} = tokens[index];
            let [, title = ''] = info.split(' ');
            return `<san-code-block title="${title}"> ${content} </san-code-block>`;
        }
    }))
    .use(require('markdown-it-container'), 'spoiler', {

        validate(params) {
            console.log(params);
            return params.trim().match(/^spoiler\s+(.*)$/);
        },

        render(tokens, idx) {
            let m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<details><summary>' + m[1] + '</summary>\n';

            }

            // closing tag
            return '</details>\n';
        }
    });


let text = fs.readFileSync(path.join(__dirname, './test.md'), 'utf8');

let result = md.render(text);

console.log(result);

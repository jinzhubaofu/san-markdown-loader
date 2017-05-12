/**
 * @file SanComponentCodeBlock
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const markdownitfence = require('./fence');
const _ = require('lodash');

const COMPONENT_NAME = 'san-code-block';

function resolveFenceData(fence) {

    fence = fence.trim();

    let prefix = fence.slice(0, 3);
    let title = fence.slice(4);

    return {
        prefix,
        title
    };

}

module.exports = function (md) {

    return markdownitfence(md, COMPONENT_NAME, {
        validate(params) {
            let {prefix, title} = resolveFenceData(params);
            return prefix === 'san' && title;
        },
        render(tokens, index, options, env, self) {

            let {info, content} = tokens[index];
            let {title} = resolveFenceData(info);

            return `
<san-code-block title="${title}" content="${_.escape(content)}">
    ${content}
</san-code-block>
`;

        }
    });

};

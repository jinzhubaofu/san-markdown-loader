/**
 * @file parser
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require, fecs-prefer-destructure */

const {parseFragment, treeAdapters} = require('parse5');
const {CODE_BLOCK_NAME} = require('./constants');
const NAMESPACE = 'http://www.w3.org/1999/xhtml';
const adapter = treeAdapters.default;

function traverse(node, visitors, index = 0) {

    let path = [];

    function innnerTraverse(node, parentNode, index) {

        let visitor = visitors[node.tagName || node.nodeName];
        let allVisitor = visitors['*'];

        if (visitor) {
            visitor(node, parentNode, path, index);
        }

        if (allVisitor) {
            allVisitor(node, parentNode, path, index);
        }

        path.push(node);

        if (node.nodeName === 'template') {
            innnerTraverse(node.content, node);
        }
        else {
            let childNodes = node.childNodes;
            if (childNodes && childNodes.length) {
                for (let i = 0, len = childNodes.length; i < len; i++) {
                    innnerTraverse(childNodes[i], node, i);
                }
            }
        }

        path.pop();

    }

    innnerTraverse(node, visitors, index = 0);

}

function displayAST(ast) {
    traverse(ast, {
        '*'(node, parent, path) {
            if (node.nodeName === '#text' && /\s*/.test(node.value)) {
                return;
            }
            console.log(`${path.map(p => '| ').join('')}- ${node.nodeName}[${node.tagName}]`);
        }
    });
}

function getParts(ast) {

    let template = [];
    let style = [];
    let script = [];
    let components = [];

    let liberNodes = [];

    traverse(ast, {
        '*'(node, parent, path) {

            if (path.length !== 1) {
                return;
            }

            let nodeName = node.nodeName;

            if (
                nodeName !== 'script'
                & nodeName !== 'style'
                & nodeName !== 'template'
            ) {
                liberNodes.push(node);
            }

        },
        script(node, parent, path) {
            if (path.length === 1) {
                script.push(node);
            }
        },
        template(node, parent, path) {
            if (path.length === 1) {
                template.push(node);
            }
        },
        style(node, parent, path) {
            if (path.length === 1) {
                style.push(node);
            }
        },
        [CODE_BLOCK_NAME](node) {
            components.push(node);
        }
    });

    if (liberNodes.length) {

        let root = adapter.createElement('template', NAMESPACE, []);

        let fragment = {
            nodeName: '#document-fragment',
            childNodes: [
                {
                    nodeName: '#text',
                    value: '\n'
                },
                {
                    tagName: 'section',
                    nodeName: 'section',
                    namespaceURI: NAMESPACE,
                    attrs: [],
                    childNodes: liberNodes
                }
            ]
        };

        adapter.setTemplateContent(root, fragment);

        template.push(root);
    }

    return {
        template,
        style,
        script,
        components
    };

}

function parse(code) {
    return getParts(parseFragment(code, {locationInfo: true}));
}

module.exports = {
    parse,
    getParts,
    traverse,
    displayAST
};

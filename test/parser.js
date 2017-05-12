/**
 * @file parser test
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require, max-nested-callbacks */

const {parseFragment, serialize} = require('parse5');
const expect = require('expect.js');
const parser = require('../src/parser');
const sinon = require('sinon');

describe('parser', () => {

    const md = `
    <template>
    <div>
        <p>{{count}}</p>
        <san-button on-click="hello">
            click me
        </san-button>
        <san-code-block>aaa</san-code-block>
        <san-code-block>bbb</san-code-block>
        <div id="for-test"></div>
        <template>test 2</template>
    </div>
    </template>
    <script>
    import Button from './Button';
    export default {
        hello() {
            this.data.set('count', this.data.get('count') + 1);
        },
        components: {
            'san-button': Button
        },
        initData() {
            return {
                count: 0
            };
        }
    };
    </script>`;

    const ast = parseFragment(md);

    describe('traverse', () => {

        it('is function', () => {
            expect(parser.traverse).to.be.a('function');
        });

        it('traverse every node', () => {

            let scriptSpy = sinon.spy();
            let templateSpy = sinon.spy();
            let divSpy = sinon.spy();

            parser.traverse(ast, {
                script: scriptSpy,
                template: templateSpy,
                div: divSpy
            });

            expect(scriptSpy.callCount).to.be(1);
            expect(templateSpy.callCount).to.be(2);
            expect(divSpy.callCount).to.be(2);


        });

        it('* visitor', () => {
            let ast = parseFragment('<div><b>a</b><i>a</i></div>');
            let allVisitorSpy = sinon.spy();
            parser.traverse(ast, {'*': allVisitorSpy});
            expect(allVisitorSpy.callCount).to.be(6);
        });

    });

    describe('getParts', () => {

        it('is function', () => {
            expect(parser.getParts).to.be.a('function');
        });

        it('get correct parts', () => {

            let {template, script, style, components} = parser.getParts(ast);

            expect(template.length).to.be(1);
            expect(script.length).to.be(1);
            expect(style.length).to.be(0);
            expect(components.length).to.be(2);

        });

        it('put all root nodes in a template if no root template', () => {

            let source = '<h1>aaa</h1> <script>var a = 1;</script>';
            let ast = parseFragment(source);
            let parts = parser.getParts(ast);
            let target = `<template>${source}</template>`;

            expect(parts.template.length).to.be(1);
            expect(parts.template[0].nodeName).to.be('#document-fragment');
            expect(serialize(parts.template[0])).to.be(target);

        });

    });

});

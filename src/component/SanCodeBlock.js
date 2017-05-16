/**
 * @file SanCodeBlock
 * @author leon <ludafa@outlook.com>
 */

'use strict';

import san from 'san';
import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';
import _ from 'lodash';
import './SanCodeBlock.css';

export default class SanCodeBlock extends san.Component {

    /* eslint-disable max-len */
    static template = `
        <section class="san-markdown-loader-code-block">
            <h4
                class="san-markdown-loader-code-block-title"
                on-click="toggleSource">
                <label>{{title}}</label>
                <svg viewBox="0 0 24 24" style="display: inline-block; color: rgba(0, 0, 0, 0.87); fill: currentcolor; height: 24px; width: 24px; user-select: none; transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></svg>
            </h4>
            <p
                san-if="!!description"
                class="san-markdown-loader-code-block-description">
                {{description}}
            </p>
            <div class="san-markdown-loader-code-block-source" style="{{sourceStyle}}">
                <pre><code class="html">{{_content}}</code></pre>
            </div>
            <div class="san-markdown-loader-code-block-box">
                <slot />
            </div>
        </section>
    `;
    /* eslint-enable max-len */

    static computed = {
        sourceStyle() {
            let expanded = this.data.get('expanded');
            return {
                'max-height': expanded ? 'auto' : '0',
                'overflow': 'hidden'
            };
        },
        /* eslint-disable fecs-camelcase */
        _content() {
            return _.unescape(this.data.get('content'))
                .replace(/&#x7B;/g, '{')
                .replace(/&#x7D;/g, '}');
        }
        /* eslint-enable fecs-camelcase */
    };

    initData() {
        return {
            expanded: false
        };
    }

    attached() {

        let codeElement = this.el.querySelector('pre');

        if (!codeElement) {
            return;
        }

        try {
            highlight.highlightBlock(codeElement);
        }
        catch (e) {
            console.log(e);
        }

    }

    toggleSource() {
        let expanded = this.data.get('expanded');
        this.data.set('expanded', !expanded);
    }

}

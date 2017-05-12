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
            return _.unescape(this.data.get('content'));
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

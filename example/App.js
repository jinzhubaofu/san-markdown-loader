/**
 * @file App
 * @author leon <ludafa@outlook.com>
 */

import san from 'san';
import ReadMe from './README.md';

export default san.defineComponent({

    template: `
        <div class="hello">
            hello {{msg}}
            <read-me />
        </div>
    `,

    components: {
        'read-me': ReadMe
    },

    initData() {
        return {
            msg: 'world'
        };
    }

});

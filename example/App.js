/**
 * @file App
 * @author leon <ludafa@outlook.com>
 */

import san from 'san';
import ReadMe from './README.md';
import Divider from './Divider';

export default san.defineComponent({

    template: `
        <div class="hello">
            aaaa
            <san-divider />
            <read-me />
            hello {{msg}}
            <h3>aaa</h3>
        </div>
    `,

    components: {
        'read-me': ReadMe,
        'san-divider': Divider
    },

    initData() {
        return {
            msg: 'world'
        };
    }

});

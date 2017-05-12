/**
 * @file Test Button
 * @author leon <ludafa@outlook.com>
 */

import san from 'san';

export default san.defineComponent({

    template: `
        <button on-click="add">click me {{count}}</button>
    `,

    initData() {
        return {
            count: 0
        };
    },

    add() {
        this.data.set('count', this.data.get('count') + 1);
    }

});

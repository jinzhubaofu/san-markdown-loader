/**
 * @file divider
 * @author leon <ludafa@outlook.com>
 */

import san from 'san';

export default san.defineComponent({

    template: `
        <hr />
    `,
    inited() {
        console.log(this.data.get());
    }

});

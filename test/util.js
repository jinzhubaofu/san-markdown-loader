/**
 * @file util
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const {parseFragment} = require('parse5');
const ast = parseFragment(`
    <h2>aaaa</h2>
<pre><code class="language-js"><span class="hljs-keyword">var</span> a = <span class="hljs-number">1</span>;
</code></pre>

<san-code-block title="test">
    <template>
    <div>aaa</div>
</template>
<script>
export default {
    inited() {
        console.log(12321);
    }
};
</script>

</san-code-block>
`);
const {displayAST} = require('../src/util');

displayAST(ast);

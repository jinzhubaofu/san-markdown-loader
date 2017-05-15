## aaaa

卧槽，终于搞起来了。。。

+ 1
+ 2

    ```san test
    <template>
        <div>
            <button myAttrs="111" class="test" on-click="minus" disabled="disabled">-</button>
            {{count}}
            <button class="test" on-click="add">+</button>
            <div class="test-test">
                another button <san-button primaryText="12321">aaa</san-button>
            </div>
        </div>
    </template>
    <script>
    import Button from './Button';
    export default {
        components: {
            'san-button': Button
        },
        initData() {
            return {
                count: 1
            };
        },
        inited() {
            console.log(12321);
        },
        add() {
            this.data.set('count', this.data.get('count') + 1);
        },
        minus() {
            this.data.set('count', this.data.get('count') - 1);
        }
    };
    </script>
    <style>
    .test {
        color: rgb(0, 159, 147)
    }
    </style>
    ```

---
```san another silly demo
<template>
    <section>
        <button disabled>disabled</button>
        hello <input value={=name=} />, <button on-click="ok">ok</button>
    <section>
</template>
<script>
export default {
    initData() {
        return {
            name: 'san'
        };
    },
    ok() {
        alert(this.data.get('name'));
    }
};
</script>
```

```js
var a = 1;
```

```sh
npm install
```

<style>
.test-test > * {
    color: rgb(0, 159, 147)
}
</style>

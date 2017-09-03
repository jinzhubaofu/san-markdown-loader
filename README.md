# san-markdown-loader

import markdown files as a [san](https://ecomfe.github.io/san) component

## NOTICE

We extract `san` code block out of `.md` files and cache theme in files at a `.cache` directory.
So this may trigger webpack's recompile if `watch` is on.
To avoid this, add the `WatchIgnorePlugin` in your webpack config file:

```js
{
    // ...
    plugins: [
        // ...
        new webpack.WatchIgnorePlugin([
            /\.cache/
        ])
    ]
}
```

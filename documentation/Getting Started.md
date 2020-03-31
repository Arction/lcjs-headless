# Getting Started

Install both `@arction/lcjs-headless` and `@arction/lcjs` from npm.

When creating a new chart make sure to import the `lightningChart()` function from `@arction/lcjs-headless` instead of `@arction/lcjs`. Other LightningChart JS related imports can be imported from `@arction/lcjs`.

To render a chart to a buffer, call `chart.engine.renderFrame(width, height)`. This function will provide you a buffer containing a single image.

```js
import { lightningChart } from '@arction/lcjs-headless'

const lc = lightningChart()
const chart = lc.ChartXY()

chart.engine.renderFrame(1280, 720)
```

The `@arction/lcjs-headless` package provides a couple of helper functions to make the use of LightningChart JS in Node JS environment easier. You can render an image directly to a `sharp` or `pngjs` objects with `renderToSharp` and `renderToPNG` helper functions.

```js
import { lightningChart, renderToSharp } from '@arction/lcjs-headless'

const lc = lightningChart()
const chart = lc.ChartXY()

renderToSharp(chart, 1920, 1080)
    .toFile('out.png')
```
```js
const fs = require('fs')
const { PNG } = require('pngjs')
const { lightningChart, renderToPNG } = require('@arction/lcjs-headless')

const lc = lightningChart()
const chart = lc.ChartXY()

const chartOutput = renderToPNG(chart, 1920, 1080)
const outputBuff = PNG.sync.write(chartOutput)
fs.writeFileSync('./chartOutput.png', outputBuff)
```

## Headless in Linux machine

When running lcjs-headless in a Linux environment that doesn't provide a X11 or OpenGL environment you will need two more packages to make the environment ready for lcjs-headless.

1. [Xvfb][Xvfb]

2. [Mesa][Mesa]

`xvfb-run -s "-ac -screen 0 1280x720x24" <node program>`

[Mesa]:https://www.mesa3d.org/intro.html
[Xvfb]:https://en.wikipedia.org/wiki/Xvfb

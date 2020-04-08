# LightningChart JS Node JS support package

Node JS support package for LightningChart JS.

This package uses [JSDOM][jsdom], [node-canvas][node-canvas] and [headless-gl][gl] to bring the [LightningChart JS][lcjs] to Node JS.

## Getting Started

Start by installing both `@arction/lcjs-headless` and `@arction/lcjs`.

Import `lightningChart` function from this package instead of `@arction/lcjs` package.
Otherwise the use of Lightning Chart is same as with the web version. Few notable differences are that animations are disabled by default and to get image output you will need to call `chart.engine.renderFrame(width, height)`. This method will return you UInt8Array that contains the frame.

## Using helpers

There is a few helper methods available that are exported by this package.

### `renderToSharp`

* Requires `sharp` package to be installed. [https://sharp.pixelplumbing.com/][sharp]
    * Also install `@types/sharp` if you are using TypeScript
* Prepares the frame to a "sharp" object, which allows the use of `sharp` to manipulate the image further or export it to a many different image formats.

```js
import { lightningChart, renderToSharp } from '@arction/lcjs-headless'

const lc = lightningChart()

const chart = lc.ChartXY()

renderToSharp(chart, 1920, 1080)
    .toFile('out.png')
```

### `renderToPNG`

* Requires `pngjs` package to be installed. [https://github.com/lukeapage/pngjs][pngjs]
    * Also install `@types/pngjs` if you are using TypeScript.
* Prepares the frame to a PNG image which can then be written to disk.
```js
const fs = require('fs')
const { PNG } = require('pngjs')
const chartOutput = renderToPNG(chart, 1920, 1080)
const outputBuff = PNG.sync.write(chartOutput)
fs.writeFileSync('./chartOutput.png', outputBuff)
```

### `renderToBase64`

* Requires `pngjs` package to be installed. [https://github.com/lukeapage/pngjs][pngjs]
    * Also install `@types/pngjs` if you are using TypeScript.
* Uses the `pngjs` package to encode the raw RGBA data to a PNG and then encodes the buffer to a base 64 string.

### `renderToDataURI`

* Requires `pngjs` package to be installed. [https://github.com/lukeapage/pngjs][pngjs]
    * Also install `@types/pngjs` if you are using TypeScript.
* Uses the `pngjs` package to encode the raw RGBA data to a PNG and then encodes the buffer to a base 64 string and adds the required data uri string.

### `renderToRGBABuffer`

* Creates a raw Node JS buffer from the UInt8Array that is returned by the `chart.engine.renderFrame`.

## Font support

Different font's can be easily used.

The font is specified in the application code just like you would specify it when using LightningChart JS in browser.

If the font is not a system font, then it needs to be registered before it can be used. Registering should be done before any chart is created. Registering can be done with `registerFont` function. If the font is not found, then a default font for the system will be used.
This function is re-exported by this package from the `node-canvas` package.

```js
import { lightningChart, registerFont } from '@arction/lcjs-headless'
// Register Open Sans font from a font file
registerFont('OpenSans-Regular.ttf',{ family: 'Open Sans' })

// Create a chart
const lc = lightningChart()
const chart = lc.ChartXY()
// Use the registered font
chart.setTitleFont(f=>f.setFamily('Open Sans'))
```

## Anti-aliasing

Anti-aliasing that is normally available in browsers is not available when using LightningChart JS in Node environment.

The `devicePixelRatio` option when creating a chart can be used to render the chart with higher resolution while scaling all elements so that when the image is downsampled to the target resolution it's displayed correctly but with the benefits of using higher resolution. Rendering at higher resolution is more work so the rendering is slower.

```js
import { lightningChart, renderToSharp } from '@arction/lcjs-headless'

// Create a chart
const lc = lightningChart()
// Create the chart with a devicePixelRatio 3 to render at higher resolution for downsampling
const chart = lc.ChartXY({ devicePixelRatio: 3 })
// render the chart to a sharp object
// the renderToSharp has built in support for downsampling by providing the pixelRatio as the fourth parameter
renderToSharp(chart, 1920, 1080, false, 3)
    .toFile('out.png')
```

Only the `renderToSharp` helper has a built in scaling to downsample the image.
Other helpers or using the `chart.engine.renderFrame` method do not have built in scaling, instead these APIs will return the image at a resolution that is multiplied by the devicePixelRatio.

[lcjs]: https://www.arction.com/lightningchart-js/
[gl]: https://github.com/stackgl/headless-gl
[jsdom]: https://github.com/jsdom/jsdom
[node-canvas]: https://github.com/Automattic/node-canvas
[sharp]: https://sharp.pixelplumbing.com/
[pngjs]: https://github.com/lukeapage/pngjs

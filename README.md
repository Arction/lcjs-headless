# LightningChart JS Node JS support package

Node JS support package for LightningChart JS.

This package uses JSDOM, node-canvas and headless-gl to bring the LightningChart JS to Node JS.

## Programming notes

This package will add few browser specific APIs to the Node JS Global context. This is done to make the Node JS environment compatible with LightningChart JS.

## Font support

Different font's can be easily used.

The font is specified in the application code just like you would when using LightningChart JS in browser.

If the font is not a system font, then it needs to be registered before it can be used. Registering should be done before any chart is created. Registering can be done with `registerFont` function.
This function is re-exported by this package from the node-canvas package.

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

## Usage

Start by installing both `@arction/lcjs-headless` and `@arction/lcjs`.

Import `lightningChart` function from this package instead of `@arction/lcjs` package.
Otherwise the use of Lightning Chart is same as with the web version. Few notable differences is that animations are disabled by default and to get image output you will need to call `chart.engine.renderFrame(width, height)`. This method will return you UInt8Array that contains the frame.


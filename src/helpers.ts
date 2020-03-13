import { Control } from "@arction/lcjs"
import { Sharp } from 'sharp'
import { PNG } from 'pngjs'
let sharp
let PNGConstructor
// try to load "sharp" package
try {
    sharp = require('sharp')
} catch (e) { }
// try to load "pngjs" package
try {
    PNGConstructor = require('pngjs').PNG
} catch (e) { }

/**
 * Function type for all renderToZZZ helper methods.
 */
export type FuncRenderTo<T> = (chart: Control, width: number, height: number, noFlip?: boolean) => T
/**
 * Function type for all renderToZZZ helper methods.
 */
export type FuncRenderToWithPixelRatio<T> = (chart: Control, width: number, height: number, noFlip?: boolean, pixelRatio?: number) => T

/**
 * Render chart to a Sharp object.
 * 
 * Sharp is an high performance image processing library for Node JS.
 * It allows exporting the image to many different formats and doing image manipulation easily.
 * 
 * **The "sharp" module has to be installed to the host application.**
 * If the "sharp" module is missing, an error will be thrown.
 * 
 * ```js
 * renderToSharp(chart, 1920, 1080)
 *  .toFile('chartOutput.webp')
 * ```
 * 
 * Example for using the `pixelRatio` option:
 * ```js
 * const pixelRatio = 3
 * // render the chart with higher pixel ratio for higher quality image.
 * const chart = lightningChart().ChartXY({ devicePixelRatio: pixelRatio })
 * // supply pixel ratio so that the `renderToSharp` method knows to downsample the image correctly
 * // chart is rendered at 5760x3240 resolution and then downsampled to 1920x1080
 * renderToSharp(chart, 1920, 1080, false, pixelRatio)
 *  .toFile('chartOutput.webp')
 * ```
 * 
 * @param chart         Chart to render.
 * @param width         Rendering resolution width.
 * @param height        Rendering resolution height.
 * @param noFlip        Leave the image upside down.
 * @param pixelRatio    Pixel ratio, assume that the chart was rendered with this as the `devicePixelRatio`. 
 *                      Downsample the frame back to the defined resolution.
 */
export const renderToSharp: FuncRenderToWithPixelRatio<Sharp> = (chart, width, height, noFlip?, pixelRatio?): Sharp => {
    if (!sharp) {
        throw new Error('Module "sharp" not found!')
    }
    const ratio = pixelRatio || 1
    const frame = chart.engine.renderFrame(width, height, noFlip)
    const s = sharp(Buffer.from(frame), {
        raw: {
            channels: 4,
            width: width * ratio,
            height: height * ratio
        }
    })
    return ratio !== 1 ? s.resize(width, height) : s
}

/**
 * Render chart to a PNG.
 * 
 * PNG support is provided by "pngjs" package.
 * 
 * pngjs is a simple PNG encoder/decoder for Node JS with no dependencies.
 * 
 * **The "pngjs" module has to be installed to the host application.**
 * If the "pngjs" module is missing, an error will be thrown.
 * 
 * ```js
 * const fs = require('fs')
 * const { PNG } = require('pngjs')
 * const chartOutput = renderToPNG(chart, 1920, 1080)
 * const outputBuff = PNG.sync.write(chartOutput)
 * fs.writeFileSync('./chartOutput.png', outputBuff)
 * ```
 * @param chart     Chart to render.
 * @param width     Rendering resolution width.
 * @param height    Rendering resolution height.
 * @param noFlip    Leave the image upside down.
 */
export const renderToPNG: FuncRenderTo<PNG> = (chart, width, height, noFlip?): PNG => {
    if (!PNGConstructor) {
        throw new Error('Module "pngjs" not found!')
    }
    const frame = chart.engine.renderFrame(width, height, noFlip)
    const buff = Buffer.from(frame)
    const png = new PNGConstructor({ width, height })
    png.data = buff
    return png
}

/**
 * Render chart to a Base 64 encoded PNG.
 * 
 * PNG support is provided by "pngjs" package.
 * 
 * pngjs is a simple PNG encoder/decoder for Node JS with no dependencies.
 * 
 * **The "pngjs" module has to be installed to the host application.**
 * If the "pngjs" module is missing, an error will be thrown.
 * 
 * ```js
 * const chartOutput = renderToBase64(chart, 1920, 1080)
 * console.log(chartOutput)
 * ```
 * @param chart     Chart to render.
 * @param width     Rendering resolution width.
 * @param height    Rendering resolution height.
 * @param noFlip    Leave the image upside down.
 */
export const renderToBase64: FuncRenderTo<string> = (chart, width, height, noFlip?): string => {
    const png = renderToPNG(chart, width, height, noFlip)
    const outputBuff = PNGConstructor.sync.write(png)
    return outputBuff.toString('base64')
}

/**
 * Render chart to a data URI format, Base64 encoded PNG.
 * 
 * Adds the "data:image/png;base64," prefix Base64 encoded PNG.
 * 
 * PNG support is provided by "pngjs" package.
 * 
 * pngjs is a simple PNG encoder/decoder for Node JS with no dependencies.
 * 
 * **The "pngjs" module has to be installed to the host application.**
 * If the "pngjs" module is missing, an error will be thrown.
 * 
 * ```js
 * const chartOutput = renderToDataURI(chart, 1920, 1080)
 * console.log(chartOutput)
 * ```
 * @param chart     Chart to render.
 * @param width     Rendering resolution width.
 * @param height    Rendering resolution height.
 * @param noFlip    Leave the image upside down.
 */
export const renderToDataURI: FuncRenderTo<string> = (chart, width, height, noFlip?): string => {
    const outputBuff = renderToBase64(chart, width, height, noFlip)
    return `data:image/png;base64,${outputBuff}`
}

/**
 * Render chart to a Buffer.
 * 
 * Image data is stored in the buffer as a plain 32 bit RGBA data.
 * 
 * ```js
 * const chartOutput = renderToRGBABuffer(chart, 1920, 1080)
 * console.log(chartOutput)
 * ```
 * @param chart     Chart to render.
 * @param width     Rendering resolution width.
 * @param height    Rendering resolution height.
 * @param noFlip    Leave the image upside down.
 */
export const renderToRGBABuffer: FuncRenderTo<Buffer> = (chart, width, height, noFlip?): Buffer => {
    const uBuffer = chart.engine.renderFrame(width, height, noFlip)
    return Buffer.from(uBuffer)
}

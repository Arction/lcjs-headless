import { Control } from "@arction/lcjs"
import { Sharp } from 'sharp'
import { PNG } from 'pngjs'
let sharp
let PNGConstructor
try {
    sharp = require('sharp')
} catch (e) { }
try {
    PNGConstructor = require('pngjs').PNG
} catch (e) { }

/**
 * Function type for all renderTo... helper methods.
 */
export type FuncRenderTo<T> = (chart: Control, width: number, height: number, noFlip?: boolean) => T

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
 * @param chart     Chart to render.
 * @param width     Rendering resolution width.
 * @param height    Rendering resolution height.
 * @param noFlip    Leave the image upside down.
 */
export const renderToSharp: FuncRenderTo<Sharp> = (chart, width, height, noFlip?): Sharp => {
    if (!sharp) {
        throw new Error('Module "sharp" not found!')
    }
    const frame = chart.engine.renderFrame(width, height, noFlip)
    return sharp(Buffer.from(frame), {
        raw: {
            channels: 4,
            width,
            height
        }
    })
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
        throw new Error('Module "sharp" not found!')
    }
    const frame = chart.engine.renderFrame(width, height, noFlip)
    const buff = Buffer.from(frame)
    const png = new PNGConstructor({ width, height })
    png.data = buff
    return png
}

import { Control } from "@arction/lcjs"
import { Sharp } from 'sharp'
import { PNG } from 'pngjs'
let sharp
let PNGConstructor
try {
    sharp = require('sharp').Sharp
} catch (e) { }
try {
    PNGConstructor = require('pngjs').PNG
} catch (e) { }

export const toSharp = (chart: Control, width: number, height: number, noFlip?: boolean): Sharp => {
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

export const toPNGJS = (chart: Control, width: number, height: number, noFlip?: boolean): PNG => {
    if (!PNGConstructor) {
        throw new Error('Module "sharp" not found!')
    }
    const frame = chart.engine.renderFrame(width, height, noFlip)
    const buff = Buffer.from(frame)
    const png = new PNGConstructor({ width, height })
    png.data = buff
    return png
}

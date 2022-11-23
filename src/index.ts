// provides a virtual dom for lcjs to use
import { JSDOM } from 'jsdom'
// font support
import { createCanvas, registerFont, Image } from 'canvas'
// headless-gl that implements WebGL in Node
import createContext from 'gl'
import { polyfill as rafPolyfill } from 'raf'
import * as fs from 'fs'
import * as path from 'path'

// create a virtual dom
const dom = new JSDOM(``, { pretendToBeVisual: false })

// polyfill requestAnimationFrame to prevent the chart from throwing an error
rafPolyfill(dom.window);

/**
 * Headless gl resize interface definition
 * 
 * The method is provided by the 'gl' package but it doesn't have type that can be accessed,
 * so created it here.
 */
interface StackGlResize {
    /**
     * Resize the render buffer of the rendering context
     */
    resize: (width: number, height: number) => void
}

// overwrite getContext to return headless-gl webgl context
const orig_getContext = dom.window.HTMLCanvasElement.prototype.getContext
dom.window.HTMLCanvasElement.prototype.getContext = function () {
    if (arguments[0] === 'webgl') {
        // create headless-gl GL context
        const ctx: ReturnType<typeof createContext> & Partial<StackGlResize> = createContext(1, 1, arguments[1])
        // insert the resize method to the context so that lcjs package can use it
        ctx.resize = ctx.getExtension('STACKGL_resize_drawingbuffer').resize
        return ctx
    } else {
        return orig_getContext.apply(this, arguments)
    }
}

// overwrite fetch to make loading files from local file system possible
const origFetch = dom.window.fetch
dom.window.fetch = function () {
    return new Promise((resolve, reject) => {
        const url = arguments[0]
        if (url && typeof url === 'string') {
            // local file urls are provided as `fs:<path>`
            if (url.startsWith('fs:')) {
                const split = url.split('fs:')
                const actualPath = split[1]
                fs.readFile(actualPath, (err, data) => {
                    if (err) {
                        return reject(err)
                    }
                    // resolve as object with `json` method to match the required interface on the LCJS side
                    resolve({
                        json: () => {
                            return new Promise((resolve, reject) => {
                                const dataStr = data.toString()
                                try {
                                    const parsed = JSON.parse(dataStr)
                                    return resolve(parsed)
                                } catch (e) {
                                    return reject(e)
                                }
                            })
                        }
                    })
                })
            }
        } else {
            return origFetch.apply(this, arguments)
        }
    })
}

// suppress alert
dom.window.alert = function () { }

dom.window.Image = Image

dom.window.lcjs_setup = createCanvas

/**
 * Monkey patch a function from LightningChart interface.
 * Inserts the default parameters that are different from browser environment.
 * @param func Function to patch
 */
const monkeyPatchLightningChartInterfaceFunction = (func) => {
    return function () {
        let args = arguments
        // ensure that the args object exists
        if (!args[0]) {
            // NOTE: Type is not fulfilled. The "callee" is still missing
            args = [{}] as unknown as IArguments
        }

        // overwrite the default arguments
        // the original user given arguments take priority over the new defaults
        args[0] = Object.assign({}, {
            maxFps: -1,
            disableAnimations: true,
            interactable: false,
        }, args[0])

        // call the original function with modified arguments
        return func.apply(null, args)
    }
}

// set the JSDOM window to a global variable
// lcjs package will take this reference to use window APIs
(global as any)._lcjs = dom.window

import { lightningChart as originalLc, LightningChart } from '@arction/lcjs'

// delete the window reference from global context as lcjs has taken a reference to it now.
delete (global as any)._lcjs

// monkey patch the lightningChart function,
// so that its possible to edit the default parameters without actually editing lcjs
const lightningChart: typeof originalLc = function () {
    let args = arguments
    if (!args[0]) {
        args = [{}] as unknown as IArguments
    }
    // insert default arguments
    args[0] = Object.assign({}, {
        resourcesBaseUrl: `fs:${path.resolve(process.cwd(), 'resources')}`
    }, args[0])
    // call the original lightningChart function to get the entry points
    const lc = originalLc.apply(null, args)

    // replace all functions of the object returned by lightningChart function,
    // with versions of functions that make sure that the default parameters are good for node support
    const outputLC = {}
    for (const key in lc) {
        outputLC[key] = monkeyPatchLightningChartInterfaceFunction(lc[key])
    }
    return outputLC as LightningChart
}

export {
    lightningChart,
    registerFont
}
export * from './helpers'

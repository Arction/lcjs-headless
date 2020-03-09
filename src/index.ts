// provides a virtual dom for lcjs to use
import { JSDOM } from 'jsdom'
// font support
import { registerFont } from 'canvas'
// headless-gl that implements WebGL in Node
import createContext from 'gl'

// create a virtual dom
const dom = new JSDOM(``, { pretendToBeVisual: false })

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

// ensure that needed global methods and objects exist

// make "document" exist in the global context
global.document = dom.window.document
// make "window" exist in the global context
global.window = dom.window
// make "atob" exist in the global context
global.atob = dom.window.atob
// make "Blob" exist in the global context
global.Blob = dom.window.Blob
// make "navigator" exist in the global context
global.navigator = dom.window.navigator

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
            disableAnimations: true
        }, args[0])

        // call the original function with modified arguments
        return func.apply(null, args)
    }
}

import { lightningChart as originalLc, LightningChart } from '@arction/lcjs'

// monkey patch the lightningChart function,
// so that its possible to edit the default parameters without actually editing lcjs
const lightningChart: typeof originalLc = function () {
    // call the original lightningChart function to get the entry points
    const lc = originalLc.apply(null, arguments)

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

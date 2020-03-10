// Extend the Node JS Global to support the required global variables
declare module NodeJS {
    interface Global {
        document: Document
        window: Window
    }
}

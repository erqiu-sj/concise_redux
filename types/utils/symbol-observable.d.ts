declare global {
    interface SymbolConstructor {
        readonly observable: symbol;
    }
}
declare const $$observable: string | typeof Symbol.observable;
export default $$observable;

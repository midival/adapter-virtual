import { IMIDIAccess, IMIDIInput, IMIDIOutput, UnregisterCallback } from "@midival/core";
import { InputStateChangeCallback, OutputStateChangeCallback } from "@midival/core/dist/wrappers/access/IMIDIAccess";

export class MIDIValAgregateAccessAdapter implements IMIDIAccess {
    private _accessObjects: IMIDIAccess[];
    constructor(accessObjects: IMIDIAccess[]) {
        this._accessObjects = accessObjects;
    }
    connect(): Promise<void> {
        return Promise.all(this._accessObjects.map(x => x.connect()))
        .then();
    }
    get inputs(): IMIDIInput[] {
        return this._accessObjects.reduce((accumulator, access) => ([
            ...accumulator,
            ...access.inputs
        ]), [])
    }
    get outputs(): IMIDIOutput[] {
        return this._accessObjects.reduce((accumulator, access) => ([
            ...accumulator,
            ...access.outputs,
        ]), []);
    }
    onInputConnected(callback: InputStateChangeCallback): UnregisterCallback {
        let callbacks = this._accessObjects.map(access =>
            access.onInputConnected(callback));
        return () => {
            callbacks.forEach(x => x());
        }
    }
    onInputDisconnected(callback: InputStateChangeCallback): UnregisterCallback {
        let callbacks = this._accessObjects.map(access =>
            access.onInputDisconnected(callback));
        return () => {
            callbacks.forEach(x => x());
        }
    }
    onOutputConnected(callback: OutputStateChangeCallback): UnregisterCallback {
        let callbacks = this._accessObjects.map(access =>
            access.onOutputConnected(callback));
        return () => {
            callbacks.forEach(x => x());
        }
    }
    onOutputDisconnected(callback: OutputStateChangeCallback): UnregisterCallback {
        let callbacks = this._accessObjects.map(access =>
            access.onOutputDisconnected(callback));
        return () => {
            callbacks.forEach(x => x());
        }
    }
}
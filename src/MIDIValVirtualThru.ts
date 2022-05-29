import { IMIDIInput, IMIDIOutput } from "@midival/core";

export class MIDIValVirtualThru {
    private _midiIn: IMIDIInput;
    private _midiOut: IMIDIOutput;
    private _isRunning: boolean;
    constructor(midiIn: IMIDIInput, midiOut: IMIDIOutput) {
        this._midiIn = midiIn;
        this._midiOut = midiOut;
        this._isRunning = false;
        this.setupDevices();
    }

    private setupDevices() {
        this._midiIn.onMessage(message => {
        if (!this._isRunning) {
            return;
        }
        this._midiOut.send(message.data);
        });
    }

    stop() {
        this._isRunning = false;
    }

    start() {
        this._isRunning = true;
    }

    get input(): IMIDIInput {
        return this._midiIn;
    }

    get output(): IMIDIOutput {
        return this._midiOut;
    }
}
import { Omnibus } from "@hypersphere/omnibus";
import { IMIDIAccess, IMIDIInput, IMIDIOutput, UnregisterCallback } from "@midival/core";
import { InputStateChangeCallback, OutputStateChangeCallback } from "@midival/core/dist/wrappers/access/IMIDIAccess";
import { MIDIValVirtualDevice } from "./MidivalVirtualDevice";

interface Events {
    "on_input_connect": [IMIDIInput],
    "on_input_disconnect": [IMIDIInput],
    "on_output_connect": [IMIDIOutput],
    "on_output_disconnect": [IMIDIOutput],
}

export class MIDIvalVirtualAdapter implements IMIDIAccess {
    private _inputs: IMIDIInput[] = [];
    private _outputs: IMIDIOutput[] = [];

    private _bus: Omnibus<Events> = new Omnibus();

    onInputConnected(callback: InputStateChangeCallback): UnregisterCallback {
        return this._bus.on("on_input_connect", callback);
    }
    onInputDisconnected(callback: InputStateChangeCallback): UnregisterCallback {
        return this._bus.on("on_input_disconnect", callback);
    }
    onOutputConnected(callback: OutputStateChangeCallback): UnregisterCallback {
        return this._bus.on("on_output_connect", callback);
    }
    onOutputDisconnected(callback: OutputStateChangeCallback): UnregisterCallback {
        return this._bus.on("on_output_disconnect", callback);
    }
    
    addDevice(virtualDevice: MIDIValVirtualDevice): void {
        this.addInput(virtualDevice);
        this.addOutput(virtualDevice);
    }

    addInput(midiIn: IMIDIInput): void {
        this._inputs.push(midiIn);
        this._bus.trigger("on_input_connect", midiIn);
    }

    addOutput(midiOut: IMIDIOutput): void {
        this._outputs.push(midiOut);
        this._bus.trigger("on_output_connect", midiOut);
    }

    removeInputDevice(midiIn: IMIDIInput): void {
        this._inputs = this._inputs.filter(function(inp) {
            return inp === midiIn;
        });
        this._bus.trigger("on_input_disconnect", midiIn);
    }

    removeOutputDevice(midiOut: IMIDIOutput): void {
        this._outputs = this._outputs.filter(function(out) {
            return out === midiOut;
        });
        this._bus.trigger("on_output_disconnect", midiOut);
    }

    disconnectDevice(virtualDevice: MIDIValVirtualDevice): void {
        this.removeInputDevice(virtualDevice);
        this.removeOutputDevice(virtualDevice);
    }

    connect(): Promise<void> {
        return Promise.resolve();
    }

    get inputs(): IMIDIInput[] {
        return this._inputs;
    }

    get outputs(): IMIDIOutput[] {
        return this._outputs;
    }
}
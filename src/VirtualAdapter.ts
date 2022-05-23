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

export class MidivalVirtualAdapter implements IMIDIAccess {
    private _inputs: IMIDIInput[] = [];
    private _outputs: IMIDIOutput[] = [];
    private _manufacturer: string;

    private _bus: Omnibus<Events> = new Omnibus();

    constructor(manufacturer: string = "MIDIVal Virtual") {
        this._manufacturer = manufacturer;
    }
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
        this._inputs.push(virtualDevice);
        this._outputs.push(virtualDevice);
        this._bus.trigger("on_input_connect", virtualDevice);
        this._bus.trigger("on_output_connect", virtualDevice);
    }

    disconnectDevice(virtualDevice: MIDIValVirtualDevice): void {
        this._inputs = this._inputs.filter(function(inp) {
            return inp === virtualDevice;
        });
        this._bus.trigger("on_input_disconnect", virtualDevice);

        this._outputs = this._outputs.filter(function(out) {
            return out === virtualDevice;
        });
        this._bus.trigger("on_output_disconnect", virtualDevice);
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
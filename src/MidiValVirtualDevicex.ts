import { Omnibus } from "@hypersphere/omnibus";
import { IMIDIInput, IMIDIOutput, UnregisterCallback } from "@midival/core";
import { MIDIMessage, OnMessageCallback } from "@midival/core/dist/wrappers/inputs/IMIDIInput";

interface Events {
    "message": [MIDIMessage]
}

export class MIDIValVirtualDevice implements IMIDIOutput, IMIDIInput {
    private _bus: Omnibus<Events> = new Omnibus<Events>();
    private _id: string;
    private _name: string;
    private _manufacturer: string;
    constructor(id: string, name: string, manufacturer: string) {
        this._id = id;
        this._name = name;
        this._manufacturer = manufacturer;
    }
    async onMessage(callback: OnMessageCallback): Promise<UnregisterCallback> {
        return this._bus.on("message", callback);
    }
    send(data: Uint8Array | number[]): void {
        this._bus.trigger("message", {
            data: data instanceof Uint8Array ? data : new Uint8Array(data),
            receivedTime: Date.now(),
        });
    }
    get id(): string {
        return this._id;
    }
    get name(): string {
        return this._name;
    }
    get manufacturer(): string {
        return this._manufacturer;
    }
}
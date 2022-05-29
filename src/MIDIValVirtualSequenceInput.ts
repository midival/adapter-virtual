import { Omnibus } from "@hypersphere/omnibus";
import { UnregisterCallback } from "@midival/core";
import { makeMessage } from "@midival/core/dist/utils/MIDIMessageConvert";
import { OnMessageCallback, IMIDIInput } from "@midival/core/dist/wrappers/inputs/IMIDIInput";
import { EventBus } from "./utils";

interface Message {
    note: number,
    velocity: number,
}

export class MIDIValVirtualSequenceInput implements IMIDIInput {
    private _bus: Omnibus<EventBus> = new Omnibus();
    private _sequence: Message[];
    private _currentSequencePosition: number = 0;
    private _isRunning: boolean = false;
    async onMessage(callback: OnMessageCallback): Promise<UnregisterCallback> {
        return this._bus.on("message", callback);
    }
    id: string;
    name: string;
    manufacturer: string;

    constructor(id: string, name: string = "midival virtual sequence", manufacturer: string = "midival") {
        this.id = id;
        this.name = name;
        this.manufacturer = manufacturer;
    }

    private sendMessage(command: number, data1: number, data2: number) {
        this._bus.trigger("message", {
            receivedTime: Date.now(),
            data: makeMessage({
                channel: 1,
                command: command,
                data1,
                data2
            })
        });
    }

    startSequence(sequence: Message[], interval: number, gate: number): UnregisterCallback {
        this._sequence = sequence;
        this._isRunning = true;
        const intervalHandler = setInterval(() => {
            if (!this._isRunning) {
                return;
            }
            const m = this._sequence[this._currentSequencePosition];
            this.sendMessage(0b1001 << 4, m.note, m.velocity);
            
            this._currentSequencePosition = (this._currentSequencePosition + 1) % this._sequence.length;
            setTimeout(() => {
                this.sendMessage(0b1000 << 4, m.note, 0);
            }, interval * gate);
        }, interval);
        return () => {
            clearInterval(intervalHandler);
        }
    }

    pause() {
        this._isRunning = false;
    }

    start() {
        this._isRunning = true;
    }
}
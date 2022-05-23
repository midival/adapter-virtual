import { MIDIValInput, MIDIValOutput } from "@midival/core";
import { MIDIValVirtualDevice } from "./MidivalVirtualDevice";

describe("MIDIValVirtualDevice", () => {
    it("should properly instantiate virtual device and send note on", () => {
        const device = new MIDIValVirtualDevice("xxx", "virtual", "midival");
        const midiIn = new MIDIValInput(device);
        const midiOut = new MIDIValOutput(device);
        const fn = jest.fn();
        midiIn.onAllNoteOn(fn);
        midiOut.sendNoteOn(50, 120);
        expect(fn).toBeCalled();
        expect(fn).toBeCalledWith({
            note: 50,
            velocity: 120,
            channel: 1,
            command: 144,
            data1: 50,
            data2: 120,
        });
    });
})
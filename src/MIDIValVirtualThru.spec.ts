import { MIDIValOutput } from "@midival/core";
import { MIDIValVirtualDevice } from "./MidiValVirtualDevice";
import { MIDIValVirtualThru } from "./MIDIValVirtualThru";

describe("MIDIValVirtualThru", () => {
    it("should properly pass data from input to output", () => {
        jest
        .useFakeTimers()
        .setSystemTime(new Date('2022-01-01'));
        const midiIn = new MIDIValVirtualDevice("xxx", "xxx", "xxx");
        const midiOut = new MIDIValVirtualDevice("yyy", "yyy", "yyy");
        const thru = new MIDIValVirtualThru(midiIn, midiOut);
        thru.start();
        const fn = jest.fn();
        midiOut.onMessage(fn);
        const midivalOut = new MIDIValOutput(midiIn); // Virtual Device has both in and out
        midivalOut.sendNoteOn(64, 128);
        expect(fn).toBeCalledWith({
            data: Uint8Array.from([144, 64, 128]),
            receivedTime: 1640995200000
        });
    });

    it("should not pass data when thru is disabled", () => {
        const midiIn = new MIDIValVirtualDevice("xxx", "xxx", "xxx");
        const midiOut = new MIDIValVirtualDevice("yyy", "yyy", "yyy");
        const thru = new MIDIValVirtualThru(midiIn, midiOut);
        thru.stop();
        const fn = jest.fn();
        midiOut.onMessage(fn);
        const midivalOut = new MIDIValOutput(midiIn); // Virtual Device has both in and out
        midivalOut.sendNoteOn(64, 128);
        expect(fn).not.toBeCalled();
    })
});
import { MIDIValInput, MIDIValOutput } from "@midival/core";
import { MIDIValVirtualSequenceInput } from "./MIDIValVirtualSequenceInput";

describe("MIDIVirtualSequenceInput", () => {
    it("should properly play sequence of 3 notes", () => {
        jest.useFakeTimers("modern");
        const seq = new MIDIValVirtualSequenceInput("1234");
        const midiIn = new MIDIValInput(seq);

        const fnOn = jest.fn();
        midiIn.onAllNoteOn(fnOn);

        const fnOff = jest.fn();
        midiIn.onAllNoteOff(fnOff);

        const off = seq.startSequence([
            {
                note: 64,
                velocity: 120
            },
            {
                note: 60,
                velocity: 120,
            },
            {
                note: 20,
                velocity: 50
            }
        ], 500, 0.5);
        jest.advanceTimersToNextTimer();
        expect(fnOn).toHaveBeenLastCalledWith({ "channel": 1, "command": 144, "data1": 64, "data2": 120, "note": 64, "velocity": 120 });
        expect(fnOff).not.toBeCalled();
        jest.advanceTimersToNextTimer();
        expect(fnOff).toHaveBeenLastCalledWith({
            "channel": 1,
            "command": 128,
            "data1": 64,
            "data2": 0,
            "note": 64,
            "velocity": 0,
        });
        jest.advanceTimersToNextTimer();
        expect(fnOn).toHaveBeenLastCalledWith({"channel": 1, "command": 144, "data1": 60, "data2": 120, "note": 60, "velocity": 120});
        jest.advanceTimersToNextTimer();
        expect(fnOff).toHaveBeenCalledWith({
            "channel": 1,
            "command": 128,
            "data1": 60,
            "data2": 0,
            "note": 60,
            "velocity": 0,
        });
        jest.advanceTimersToNextTimer();
        expect(fnOn).toHaveBeenLastCalledWith({"channel": 1, "command": 144, "data1": 20, "data2": 50, "note": 20, "velocity": 50});
        jest.advanceTimersToNextTimer();
        expect(fnOff).toHaveBeenLastCalledWith({"channel": 1, "command": 128, "data1": 20, "data2": 0, "note": 20, "velocity": 0});
        
        // second run
        jest.advanceTimersToNextTimer();
        expect(fnOn).toBeCalledWith({ "channel": 1, "command": 144, "data1": 64, "data2": 120, "note": 64, "velocity": 120 });
        jest.clearAllTimers();
        off();
    });

    it("should properly play sequence of single note", () => {
        jest.useFakeTimers("modern");
        const seq = new MIDIValVirtualSequenceInput("1234");
        const midiIn = new MIDIValInput(seq);

        const fnOn = jest.fn();
        midiIn.onAllNoteOn(fnOn);

        const off = seq.startSequence([
            {
                note: 64,
                velocity: 120
            }
        ], 500, 0.5);
        jest.advanceTimersToNextTimer(); // on
        jest.advanceTimersToNextTimer(); // off
        jest.advanceTimersToNextTimer(); // on
        jest.advanceTimersToNextTimer(); // off
        jest.advanceTimersToNextTimer(); // on 
        expect(fnOn).toHaveBeenLastCalledWith({ "channel": 1, "command": 144, "data1": 64, "data2": 120, "note": 64, "velocity": 120 });
        expect(fnOn).toBeCalledTimes(3);
        off();
    });
});
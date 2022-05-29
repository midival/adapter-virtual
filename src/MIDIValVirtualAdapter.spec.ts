import { MIDIvalVirtualAdapter } from "./MIDIValVirtualAdapter"

describe("Virtual Adapter", () => {
    it("should properly instantiate virtual adapter", () => {
        const adapter = new MIDIvalVirtualAdapter();
        expect(adapter.inputs).toEqual([]);
        expect(adapter.outputs).toEqual([]);
    });
})
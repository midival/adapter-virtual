import { MIDIValVirtualAdapter } from "./MIDIValVirtualAdapter"

describe("Virtual Adapter", () => {
    it("should properly instantiate virtual adapter", () => {
        const adapter = new MIDIValVirtualAdapter();
        expect(adapter.inputs).toEqual([]);
        expect(adapter.outputs).toEqual([]);
    });
})
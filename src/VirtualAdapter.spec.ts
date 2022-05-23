import { MIDIValInput } from "@midival/core";
import { MidivalVirtualAdapter } from "./VirtualAdapter"

describe("Virtual Adapter", () => {
    it("should properly instantiate virtual adapter", () => {
        const adapter = new MidivalVirtualAdapter("midival");
        expect(adapter.inputs).toEqual([]);
        expect(adapter.outputs).toEqual([]);
    });
})
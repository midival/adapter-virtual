import { MIDIMessage } from "@midival/core/dist/wrappers/inputs/IMIDIInput";

export interface EventBus {
    "message": [MIDIMessage]
}
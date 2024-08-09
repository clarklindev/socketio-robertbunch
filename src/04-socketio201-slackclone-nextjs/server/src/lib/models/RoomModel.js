import mongoose, { Schema } from "mongoose";

// Define the Room schema
const roomSchema = new Schema({
  namespaceId: {
    type: Schema.Types.ObjectId,
    ref: "Namespace",
    required: true,
  },
  roomTitle: { type: String, required: true },
  privateRoom: { type: Boolean, default: false },
  history: [{ type: Schema.Types.ObjectId, ref: "Message" }], // Reference to Message schema
});

const Room = mongoose.model("Room", roomSchema);

export default Room;

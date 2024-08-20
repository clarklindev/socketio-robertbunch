import mongoose, { Schema } from "mongoose";

// Define the Namespace schema
const namespaceSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  endpoint: { type: String, required: true },
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }], // Reference to Room schema
});

const Namespace = mongoose.model("Namespace", namespaceSchema);

export default Namespace;

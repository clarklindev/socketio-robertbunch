import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  newMessage: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Use default to set the current date/time if not provided
  userName: { type: String, required: true },
  avatar: { type: String }, // Assuming avatar is a URL to an image
});

// Create the Message model
const Message = mongoose.model("Message", messageSchema);

export default Message;

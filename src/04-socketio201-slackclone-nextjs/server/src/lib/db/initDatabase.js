import mongoose from "mongoose";

export async function initDatabase(uri, databaseName) {
  try {
    const result = await mongoose.connect(uri, { dbName: databaseName });
    return result;
  } catch (err) {
    throw new Error("Failed to connect to database");
  }
}

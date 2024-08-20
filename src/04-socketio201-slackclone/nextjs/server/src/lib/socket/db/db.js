import mongoose from "mongoose";

export async function connectToDatabase(uri, databaseName) {
  console.log("SERVER: STEP 01 - FUNCTION connectToDatabase()");
  try {
    const result = await mongoose.connect(uri, { dbName: databaseName });
    console.log(`SERVER: connected to mongodb database: ${databaseName}`);
    return result;
  } catch (err) {
    throw new Error("SERVER: Failed to connect to database");
  }
}

// Disconnect from MongoDB
export async function disconnectFromDatabase() {
  try {
    console.log("SERVER: STEP CLEANUP - FUNCTION disconnectFromDatabase()");
    await mongoose.disconnect();
    console.log('SERVER: Disconnected from MongoDB');
  }
  catch(error){
    console.error('Error disconnecting from MongoDB:', error);
  }
}

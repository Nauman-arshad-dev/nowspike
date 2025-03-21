// E:\nauman\NowSpike\frontend\lib\mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

// Use a module-level variable instead of global.mongoose
const cached: {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
} = { conn: null, promise: null }; // Changed 'let' to 'const'

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // MONGODB_URI is guaranteed to be string here due to the earlier check
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    }).then((mongooseInstance) => mongooseInstance);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
// E:\nauman\NowSpike\frontend\lib\mongodb.ts
import mongoose from "mongoose";
import 'dotenv/config'; // Load environment variables from .env files

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI in your environment variables (e.g., .env.local or Vercel dashboard). See https://www.mongodb.com/docs/manual/reference/connection-string/ for details."
  );
}

const cached: {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
} = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    }).then((mongooseInstance) => mongooseInstance);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongo() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    // No Mongo configured — skip silently
    return;
  }

  if (isConnected) return;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    let isConnected = false;

    export async function connectMongo() {
      const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
      if (!uri) {
        // No Mongo configured — skip silently
        return;
      }

      if (isConnected) return;

      try {
        // dynamic import to avoid throwing if mongoose is not installed
        const mongoose = await import('mongoose');
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        isConnected = true;
        console.log('✅ MongoDB connected');
      } catch (err) {
        console.warn('⚠️ MongoDB not available or failed to connect. Continuing without MongoDB.');
        console.debug('Mongo error:', err && err.message ? err.message : err);
        // don't throw — keep demo app running with in-memory models
      }
    }

/**
 * MongoDB Connection (Mongoose)
 * Reads MONGODB_URI from .env and connects when the server starts.
 */
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('\n[MongoDB] ERROR: MONGODB_URI is not set in your .env file.');
    console.error('[MongoDB] Add a line like:');
    console.error('  MONGODB_URI=mongodb://127.0.0.1:27017/vireon_technologies');
    console.error('or, for MongoDB Atlas:');
    console.error('  MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/vireon_technologies\n');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });

    console.log(`[MongoDB] Connected -> ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
    console.error('[MongoDB] Make sure MongoDB is running locally (or your Atlas URI/IP whitelist is correct).');
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Connection error:', err.message);
  });
}

module.exports = connectDB;

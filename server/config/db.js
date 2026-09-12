const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/atp_score_db';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn('\n⚠️ [Database Notice]: MongoDB is not currently running at: ' + mongoUri);
    console.warn('ℹ️ The ATP Score application will still run in in-memory simulation mode.');
    console.warn('ℹ️ To enable permanent MongoDB saving, start MongoDB service or update MONGODB_URI in server/.env.\n');
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };

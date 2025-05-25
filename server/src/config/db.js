const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
require('dotenv').config();

// Use local MongoDB as fallback if MONGODB_URI is not set or has SSL issues
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-crm';

// Database Connection
const connection = mongoose.createConnection(uri);

// Since We're defining models using mongoose.model
const run = async () => {
  try {
    await mongoose.connect(uri);
    logger.log('info', 'Connected to Mongo!');
  } catch (err) {

      try {
        await mongoose.connect('mongodb://localhost:27017/mern-crm');
        logger.log('info', 'Connected to local MongoDB!');
      } catch (localErr) {
        logger.log('error', 'Failed to connect to local MongoDB as well:\n', localErr);
      }
    }
  
};

module.exports = {
  connection,
  run,
};

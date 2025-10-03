const mongoose = require('mongoose');


const dbURI = 'mongodb://localhost:27017/analytics-tool';

const connectDB = async () => {
  try {
    
    await mongoose.connect(dbURI);

    console.log('MongoDB Connected Successfully...');
  } catch (err) {
    console.error(err.message);
    
    process.exit(1);
  }
};

module.exports = connectDB;
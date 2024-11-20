const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  // Start an in-memory MongoDB server before all tests
  mongoServer = await MongoMemoryServer.create();
  
  // Get the URI for the in-memory database
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database using Mongoose
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Disconnect from the in-memory database after all tests
  await mongoose.disconnect();
  
  // Stop the in-memory MongoDB server after tests
  await mongoServer.stop();
});

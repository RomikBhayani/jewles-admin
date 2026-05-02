const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo = null;

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        if (process.env.NODE_ENV === 'test' || !uri) {
            mongo = await MongoMemoryServer.create();
            uri = mongo.getUri();
        }

        await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${uri}`);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const closeDB = async () => {
    if (mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
};

module.exports = { connectDB, closeDB };

const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server');

async function connect() {
    // const mongod = await MongoMemoryServer.create();
    // const getUri = mongod.getUri();

    mongoose.set('strictQuery',true)
    const db = await mongoose.connect('mongodb://localhost:27017/eCommerce')
    console.log('db connected')
    return db;
}

module.exports = connect;
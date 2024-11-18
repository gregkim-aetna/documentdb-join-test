import dotenv from 'dotenv';
import mongoose from 'mongoose';

import {getMongoClient} from './mongo-client.js';
import {mongoCrudExample} from './mongo-crud.js';

import {prepareMongooseClient} from './mongoose-client.js';
import {mongooseCrudExample} from './mongoose-crud.js';

dotenv.config();

// Mongo CRUD example

console.log('');
console.log('Mongo CRUD example');
const mongoClient = await getMongoClient();
await mongoCrudExample(mongoClient);

// Mongoose CRUD example

// console.log('');
// console.log('Mongoose CRUD example');
// await prepareMongooseClient();
// await mongooseCrudExample();

// Termination example

process.on('SIGINT', async () => {
    console.log('');
    console.log('Termination example');
    if (mongoClient) {
        await mongoClient.close();
        console.log('Mongo connection to DocumentDB closed.');
    }
    // await mongoose.disconnect();
    // console.log('Mongoose connection to DocumentDB closed.');
    process.exit(0);
});

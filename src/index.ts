import dotenv from 'dotenv';
import {faker} from '@faker-js/faker';

import {getMongoClient} from './mongo-client.js';
// import {makeTestData} from './make-test-data.js';
import {mongoJoinTest} from './mongo-join-test.js';

dotenv.config();
faker.seed(1);

const maxDrugs = 1000;
const maxPrescriptions = 1000;
const maxOrders = 1000;
const maxMembers = 1000;

const mongoClient = await getMongoClient();

// Make test data
// await makeTestData(mongoClient, maxDrugs, maxPrescriptions, maxOrders, maxMembers);

// Mongo join test
await mongoJoinTest(mongoClient, maxDrugs, maxPrescriptions, maxOrders, maxMembers);

process.on('SIGINT', async () => {
  if (mongoClient) {
    await mongoClient.close();
    console.log('');
    console.log('Mongo connection to DocumentDB closed.');
  }
  process.exit(0);
});

process.kill(process.pid, 'SIGINT');

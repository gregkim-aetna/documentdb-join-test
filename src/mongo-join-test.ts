import {faker} from '@faker-js/faker';
import {MongoClient} from 'mongodb';

const maxIterations = 10;

export async function mongoJoinTest(mongoClient: MongoClient, maxDrugs: number, maxPrescriptions: number, maxOrders: number, maxMembers: number): Promise<void> {
  const db = mongoClient.db(process.env.MONGODB_DATABASE);
  const members = db.collection('members');
  const orders = db.collection('orders');
  const prescriptions = db.collection('prescriptions');
  const drugs = db.collection('drugs');

  console.log('');
  console.log('1 level - find()');

  let startTime = performance.now();
  for (let i = 0; i < maxIterations; i++) {
    const memberId = faker.number.int({min: 1, max: maxMembers});
    const member = await members.findOne({memberId});
  }
  let endTime = performance.now();
  console.log(`Took an average of ${(endTime - startTime) / maxIterations} milliseconds / transaction.`);

  console.log('');
  console.log('2 level - find()');

  startTime = performance.now();
  for (let i = 0; i < maxIterations; i++) {
    const memberId = faker.number.int({min: 1, max: maxMembers});
    const member = await members.findOne({memberId});
    const order = await orders.findOne({orderId: member!.orderId});
  }
  endTime = performance.now();
  console.log(`Took an average of ${(endTime - startTime) / maxIterations} milliseconds / transaction.`);

  console.log('');
  console.log('3 level - find()');

  startTime = performance.now();
  for (let i = 0; i < maxIterations; i++) {
    const memberId = faker.number.int({min: 1, max: maxMembers});
    const member = await members.findOne({memberId});
    const order = await orders.findOne({orderId: member!.orderId});
    const prescription = await prescriptions.findOne({prescriptionId: order!.prescriptionId});
  }
  endTime = performance.now();
  console.log(`Took an average of ${(endTime - startTime) / maxIterations} milliseconds / transaction.`);

  console.log('');
  console.log('4 level - find()');

  startTime = performance.now();
  for (let i = 0; i < maxIterations; i++) {
    const memberId = faker.number.int({min: 1, max: maxMembers});
    const member = await members.findOne({memberId});
    const order = await orders.findOne({orderId: member!.orderId});
    const prescription = await prescriptions.findOne({prescriptionId: order!.prescriptionId});
    const drug = await drugs.findOne({drugId: prescription!.drugId});
  }
  endTime = performance.now();
  console.log(`Took an average of ${(endTime - startTime) / maxIterations} milliseconds / transaction.`);

  console.log('');
  console.log('1 level - aggregate()');

  startTime = performance.now();
  for (let i = 0; i < maxIterations; i++) {
    const memberId = faker.number.int({min: 1, max: maxMembers});
    const result = await members.aggregate([
      {
        $match: {memberId}
      }
    ]).toArray();
  }
  endTime = performance.now();
  console.log(`Took an average of ${(endTime - startTime) / maxIterations} milliseconds / transaction.`);

  console.log('');
  console.log('2 level - aggregate()');

  startTime = performance.now();
  for (let i = 0; i < maxIterations; i++) {
    const memberId = faker.number.int({min: 1, max: maxMembers});
    const result = await members.aggregate([
      {
        $match: {memberId}
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'orderId',
          foreignField: 'orderId',
          as: 'orderDetails'
        }
      }
    ]).toArray();
  }
  endTime = performance.now();
  console.log(`Took an average of ${(endTime - startTime) / maxIterations} milliseconds / transaction.`);

  console.log('');
  console.log('3 level - aggregate()');

  startTime = performance.now();
  for (let i = 0; i < maxIterations; i++) {
    const memberId = faker.number.int({min: 1, max: maxMembers});
    const result = await members.aggregate([
      {
        $match: {memberId}
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'orderId',
          foreignField: 'orderId',
          as: 'orderDetails'
        }
      },
      {
        $lookup: {
          from: 'prescriptions',
          localField: 'orderDetails.prescriptionId',
          foreignField: 'prescriptionId',
          as: 'prescriptionDetails'
        }
      }
    ]).toArray();
  }
  endTime = performance.now();
  console.log(`Took an average of ${(endTime - startTime) / maxIterations} milliseconds / transaction.`);

  console.log('');
  console.log('4 level - aggregate()');

  startTime = performance.now();
  for (let i = 0; i < maxIterations; i++) {
    const memberId = faker.number.int({min: 1, max: maxMembers});
    const result = await members.aggregate([
      {
        $match: {memberId}
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'orderId',
          foreignField: 'orderId',
          as: 'orderDetails'
        }
      },
      {
        $lookup: {
          from: 'prescriptions',
          localField: 'orderDetails.prescriptionId',
          foreignField: 'prescriptionId',
          as: 'prescriptionDetails'
        }
      },
      {
        $lookup: {
          from: 'drugs',
          localField: 'prescriptionDetails.drugId',
          foreignField: 'drugId',
          as: 'drugDetails'
        }
      }
    ]).toArray();
  }
  endTime = performance.now();
  console.log(`Took an average of ${(endTime - startTime) / maxIterations} milliseconds / transaction.`);
}

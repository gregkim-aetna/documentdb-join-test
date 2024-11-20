import {faker} from '@faker-js/faker';
import {Collection, MongoClient} from 'mongodb';

enum DosageUnit {
  mg = "mg",
  pill = "pill(s)"
}

const deletionDelay = 60 * 60 * 1000;

async function addDrug(drugs: Collection, id: number): Promise<void> {
  await drugs.insertOne({
    drugId: id,
    name: faker.commerce.productName(),
    deleteDate: new Date(Date.now() + deletionDelay)
  });
}

async function addPrescription(prescriptions: Collection, id: number, maxDrugs: number): Promise<void> {
  const dosageUnit = faker.helpers.enumValue(DosageUnit)
  const dosage = (dosageUnit === DosageUnit.mg) ? faker.number.int({min: 1, max: 100}) : faker.number.int({
    min: 1,
    max: 4
  });

  await prescriptions.insertOne({
    prescriptionId: id,
    drugId: faker.number.int({min: 1, max: maxDrugs}),
    dosage,
    dosageUnit,
    deleteDate: new Date(Date.now() + deletionDelay)
  });
}

async function addOrder(orders: Collection, id: number, maxPrescriptions: number): Promise<void> {
  await orders.insertOne({
    orderId: id,
    prescriptionId: faker.number.int({min: 1, max: maxPrescriptions}),
    deleteDate: new Date(Date.now() + deletionDelay)
  });
}

async function addMember(members: Collection, id: number, maxOrders: number): Promise<void> {
  await members.insertOne({
    memberId: id,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    orderId: faker.number.int({min: 1, max: maxOrders}),
    deleteDate: new Date(Date.now() + deletionDelay)
  });
}

export async function makeTestData(mongoClient: MongoClient, maxDrugs: number, maxPrescriptions: number, maxOrders: number, maxMembers: number): Promise<void> {
  console.log('');
  console.log('Creating test data.');

  const db = mongoClient.db(process.env.MONGODB_DATABASE);

  const drugs = db.collection('drugs');
  await drugs.createIndex({drugId: 1});
  for (let i = 1; i < maxDrugs + 1; i++) {
    await addDrug(drugs, i);
  }

  const prescriptions = db.collection('prescriptions');
  await prescriptions.createIndex({prescriptionId: 1});
  for (let i = 1; i < maxPrescriptions + 1; i++) {
    await addPrescription(prescriptions, i, maxDrugs);
  }

  const orders = db.collection('orders');
  await orders.createIndex({orderId: 1});
  for (let i = 1; i < maxOrders + 1; i++) {
    await addOrder(orders, i, maxPrescriptions);
  }

  const members = db.collection('members');
  await members.createIndex({memberId: 1});
  for (let i = 1; i < maxMembers + 1; i++) {
    await addMember(members, i, maxOrders);
  }

  console.log('Test data created.');
}

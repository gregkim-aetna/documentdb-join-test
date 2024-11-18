import {MongoClient} from 'mongodb';

export async function mongoCrudExample(mongoClient: MongoClient): Promise<void> {
    const db = mongoClient.db(process.env.MONGODB_DATABASE);

    const prescriptions = db.collection('prescriptions');

    await prescriptions.insertOne({
        name: 'drug-1',
        dosage: 1,
        dosageUnit: 'pill',
        deleteDate: new Date(Date.now() + 10 * 1000)
    });
    console.log('Prescription created');

    let findPrescription = await prescriptions.findOne({name: 'drug-1'});
    console.log('Prescription found:', findPrescription);

    const updateResult = await prescriptions.updateOne(
        {name: 'drug-1'},
        {$set: {dosage: 2}}
    );
    console.log('Number of prescriptions matched:', updateResult.matchedCount);
    console.log('Number of prescriptions modified:', updateResult.modifiedCount);

    findPrescription = await prescriptions.findOne({name: 'drug-1'});
    console.log('Prescription found:', findPrescription);

    const deleteResult = await prescriptions.deleteOne({name: 'drug-1'});
    console.log('Number of prescriptions deleted:', deleteResult.deletedCount);
}

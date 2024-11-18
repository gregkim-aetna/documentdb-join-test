import {Prescription} from './mongoose-model.js';

export async function mongooseCrudExample(): Promise<void> {
    const prescription = new Prescription({
        name: 'drug-2',
        dosage: 1,
        dosageUnit: 'pill',
        deleteDate: new Date(Date.now() + 10 * 1000)
    });
    await prescription.save();
    console.log('Prescription created');

    let findPrescription = await Prescription.findOne({name: 'drug-2'});
    console.log('Prescription found:', findPrescription);

    const updatePrescription = await Prescription.findOneAndUpdate(
        {name: 'drug-2'},
        {dosage: 2},
        {new: true}
    );
    console.log("Prescription updated:", updatePrescription);

    findPrescription = await Prescription.findOne({name: 'drug-2'});
    console.log('Prescription found:', findPrescription);

    await Prescription.findOneAndDelete({name: 'drug-2'});
    console.log("Prescription deleted");
}

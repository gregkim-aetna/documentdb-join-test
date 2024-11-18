import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        description: 'Drug name'
    },
    dosage: {
        type: Number,
        required: true,
        min: 1,
        description: 'Drug dosage'
    },
    dosageUnit: {
        type: String,
        required: true,
        enum: ['mg', 'pill'],
        description: 'Drug dosage unit'
    },
    deleteDate: {
        type: Date,
        required: true,
        description: "Date record will be deleted"
    }
});

export const Prescription = mongoose.model('Prescription', prescriptionSchema);

import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, lowercase: true },
    stripeSessionId: { type: String, unique: true, sparse: true },
    stripePaymentIntentId: { type: String, unique: true, sparse: true },
    stripeLastEventId: { type: String },
    stripeLastEventType: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }

}, { timestamps: true });

export const Purchase = mongoose.model('Purchase', PurchaseSchema);
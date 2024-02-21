import mongoose, {Schema} from 'mongoose';

const messageSchema = new mongoose.Schema({
    chat: {type: Schema.Types.ObjectId, required: true},
    sender: {type: Schema.Types.ObjectId, required: true},
    receiver: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true},
}, {timestamps: true});

export const Message = mongoose.model('Message', messageSchema);
import mongoose, {Schema} from 'mongoose';

const chatSchema = new mongoose.Schema({
    participants: [Schema.Types.ObjectId],
}, {timestamps: true});

export const Chat = mongoose.model('Chat', chatSchema);
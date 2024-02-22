import mongoose, {Schema} from 'mongoose';

const chatSchema = new mongoose.Schema({
    participants: [Schema.Types.ObjectId],
}, {timestamps: true});

chatSchema.pre('save', function () {
    const changes = this.getChanges();

    if (Object.keys(changes).length === 0) {
        this.set('updatedAt', new Date());
    }
});

export const Chat = mongoose.model('Chat', chatSchema);
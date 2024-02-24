import mongoose, {Schema} from 'mongoose';

const chatSchema = new mongoose.Schema({
    participants: [Schema.Types.ObjectId],
}, {timestamps: true});

// Custom hook updating chat timestamp when no changes are made
// It is used to update chats updatedAt timestamp to match last
// message sent to that chat
chatSchema.pre('save', function () {
    const changes = this.getChanges();

    if (Object.keys(changes).length === 0) {
        this.set('updatedAt', new Date());
    }
});

export const Chat = mongoose.model('Chat', chatSchema);
import mongoose, {Schema} from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    status: String,
    liked: [Schema.Types.ObjectId],
    disliked: [Schema.Types.ObjectId],
    likedBy: [Schema.Types.ObjectId],
    matches: [Schema.Types.ObjectId],
});

export const User = mongoose.model('User', userSchema);
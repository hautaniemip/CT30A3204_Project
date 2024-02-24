import {Request} from 'express'
import {Chat} from '../models/chat';
import jwt, {JwtPayload} from "jsonwebtoken";

export const match = async (user: any, createChat: boolean) => {
    if (!user)
        return;

    let matchFound = false;

    for (const likedId of user.liked) {
        for (const likedById of user.likedBy) {
            if (likedId.toString() === likedById.toString()) {
                if (!user.matches.includes(likedId)) {
                    user.matches.push(likedId);
                    matchFound = true;
                }

                if (createChat) {
                    await Chat.find({participants: {'$all': [user._id, likedById]}}).then(async (chats) => {
                        if (chats.length === 0)
                            await Chat.create({participants: [user._id, likedById]});
                    });
                }
            }
        }
    }
    user.save();
    return matchFound;
}

export const getIdFromJwtCookie = (req: Request) => {
    const token = req.cookies['access_token'];
    const decoded_token = jwt.verify(token, process.env.SECRET) as JwtPayload;
    return decoded_token._id;
}
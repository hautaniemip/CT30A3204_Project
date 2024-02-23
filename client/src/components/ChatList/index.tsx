import {useEffect, useState} from "react";
import ChatInfo from "../ChatInfo";
import "./ChatList.css"

type ChatListProps = {
    selectChat: Function;
}

type Chat = {
    _id: string;
    participants: string[];
    createdAt: string;
    updatedAt: string;
    __v: number
}

const ChatList = ({selectChat}: ChatListProps) => {
    const [chats, setChats] = useState<Chat[]>([]);
    useEffect(() => {
        fetch("/api/chats").then((res) => {
            if (res.status !== 200)
                throw new Error("Invalid request");

            return res.json();
        }).then((data) => setChats(data.chats)).catch((err) => console.error(err));
    }, []);

    return (
        <>
            <ul>
                <h3>Chats</h3>
                {chats.map((chat) => {
                    return (
                        <li key={chat._id} onClick={() => selectChat(chat._id)}>
                            <ChatInfo chatId={chat._id}/>
                        </li>
                    );
                })
                }
            </ul>
        </>
    );
}

export default ChatList;
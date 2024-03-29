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
        const interval = setInterval(() => {
            fetch("/api/chats").then((res) => {
                if (res.status !== 200)
                    throw new Error("Invalid request");

                return res.json();
            }).then((data) => setChats(data.chats)).catch((err) => console.error(err));
        }, 5000);

        fetch("/api/chats").then((res) => {
            if (res.status !== 200)
                throw new Error("Invalid request");

            return res.json();
        }).then((data) => setChats(data.chats)).catch((err) => console.error(err));

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className={"chat-list"}>
                <div className={"sub-header"}>
                    <h3>Chats</h3>
                </div>
                <div className={"chat-list-inner"}>
                    {chats.map((chat) => {
                        return <ChatInfo key={chat._id} chatId={chat._id} onClick={() => selectChat(chat._id)}/>
                    })
                    }
                </div>
            </div>
        </>
    );
}

export default ChatList;
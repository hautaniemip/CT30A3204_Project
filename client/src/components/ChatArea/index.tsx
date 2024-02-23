import {useEffect, useState} from "react";
import {Chat, Message} from "../../types/chat";
import "./ChatArea.css"

type ChatAreaProps = {
    chat: string | null;
}
const ChatArea = ({chat}: ChatAreaProps) => {
    const [chatInfo, setChatInfo] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        if (!chat)
            return;

        fetch("/api/chats/" + chat).then((res) => {
            if (res.status !== 200) {
                throw new Error("Invalid request")
            }
            return res.json();
        }).then((data) => setChatInfo(data)).catch((err) => console.error(err));

        fetch("/api/messages/" + chat).then((res) => {
            if (res.status !== 200) {
                throw new Error("Invalid request")
            }
            return res.json();
        }).then((data) => setMessages(data)).catch((err) => console.error(err));
    }, [chat]);

    return (
        <div>
            {chat &&
                <div>
                    <h3>{chatInfo && chatInfo.name}</h3>
                    <div className={"message-area"}>
                        {messages && messages.map((message) => {
                            return (<div key={message.id}><span>{message.content}</span></div>)
                        })}
                    </div>
                </div>
            }

        </div>
    )
}

export default ChatArea;
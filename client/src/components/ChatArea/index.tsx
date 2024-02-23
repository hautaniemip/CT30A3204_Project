import {useEffect, useState} from "react";
import {Chat, Message} from "../../types/chat";
import "./ChatArea.css"
import MessageBox from "./MessageBox";
import MessageView from "./MessageView";

type ChatAreaProps = {
    chat: string | null;
    closeCallback: Function;
}
const ChatArea = ({chat, closeCallback}: ChatAreaProps) => {
    const [chatInfo, setChatInfo] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [update, setUpdate] = useState<boolean>(true);

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

        setUpdate(false);
    }, [chat, update]);

    const updateOnMessageSent = () => {
        setUpdate(true);
    }

    return (
        <div>
            {chat &&
                <div className={"chat-area"}>
                    <h3><span className={"close-btn"}
                              onClick={() => closeCallback()}>X</span> {chatInfo && chatInfo.name}</h3>
                    <div className={"message-area"}>
                        {messages && messages.map((message) => {
                            return (<MessageView key={message.id} message={message}/>);
                        })}
                    </div>
                    <MessageBox chat={chat} messageSentCallback={updateOnMessageSent}/>
                </div>
            }

        </div>
    )
}

export default ChatArea;
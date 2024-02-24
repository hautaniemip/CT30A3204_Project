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

        const getMessages = () => {
            fetch("/api/messages/" + chat).then((res) => {
                if (res.status !== 200) {
                    throw new Error("Invalid request")
                }
                return res.json();
            }).then((data) => setMessages(data)).catch((err) => console.error(err));
        }

        const getChatInfo = () => {
            fetch("/api/chats/" + chat).then((res) => {
                if (res.status !== 200) {
                    throw new Error("Invalid request")
                }
                return res.json();
            }).then((data) => setChatInfo(data)).catch((err) => console.error(err));
        }

        getChatInfo();
        getMessages();

        const interval = setInterval(() => {
            getMessages();
        }, 1000);

        setUpdate(false);
        return () => clearInterval(interval);
    }, [chat, update]);

    const updateOnMessageSent = () => {
        setUpdate(true);
    }

    if (!chat)
        return (
            <div className={"chat-area"} style={{zIndex: "-1"}}>
                <div className={"sub-header"}>
                    <h3>Select chat</h3>
                </div>
            </div>
        );

    return (
        <>
            {chat &&
                <div className={"chat-area"}>
                    <div className={"sub-header"}>
                        <span className={"close-btn"} onClick={() => closeCallback()}>⨯</span>
                        <h3>{chatInfo && chatInfo.name}</h3>
                    </div>
                    <div className={"message-area"}>
                        {messages && messages.map((message) => {
                            return (<MessageView key={message.id} message={message}/>);
                        })}
                    </div>
                    <MessageBox chat={chat} messageSentCallback={updateOnMessageSent}/>
                </div>
            }

        </>
    )
}

export default ChatArea;
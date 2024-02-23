import {useEffect, useState} from "react";
import "./ChatInfo.css"
import {Chat} from "../../types/chat";

type ChatProps = {
    chatId?: string | null;
}

const ChatInfo = ({chatId = null}: ChatProps) => {
    const [chatInfo, setChatInfo] = useState<Chat | null>(null);

    useEffect(() => {
        if (!chatId)
            return;

        fetch("/api/chats/" + chatId).then((res) => {
            if (res.status !== 200) {
                throw new Error("Invalid request")
            }
            return res.json();
        }).then((data) => setChatInfo(data)).catch((err) => console.error(err));
    }, [chatId]);

    if (!chatInfo)
        return;

    return (
        <div className={"chat-info"}>
            <div className={"row"}>
                <span className={"name"}>
                    {chatInfo.name}
                </span>
                <span className={"timestamp"}>
                    {chatInfo.time ? new Intl.DateTimeFormat("fi").format(new Date(chatInfo.time)) : ""}
                </span>
            </div>
            <div>
                <span>{chatInfo.message}</span>
            </div>
        </div>
    )
}

export default ChatInfo;
import ChatList from "../ChatList";
import ChatArea from "../ChatArea";
import "./ChatManager.css";
import {useState} from "react";

const ChatManager = () => {
    const [selected, setSelected] = useState<string | null>(null);

    const selectChat = (chatId: string) => {
        setSelected(chatId);
    }

    return (
        <div className={"chat-manager"}>
            <ChatList selectChat={selectChat}/>
            <ChatArea chat={selected}/>
        </div>
    )
}

export default ChatManager;
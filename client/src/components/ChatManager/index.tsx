import ChatList from "../ChatList";
import ChatArea from "../ChatArea";
import "./ChatManager.css";
import {useState} from "react";

const ChatManager = () => {
    const [selected, setSelected] = useState<string | null>(null);

    const selectChat = (chatId: string) => {
        setSelected(chatId);
    }

    const closeChat = () => {
        setSelected(null);
    }

    return (
        <div className={"chat-manager"}>
            <ChatList selectChat={selectChat}/>
            <ChatArea chat={selected} closeCallback={closeChat}/>
        </div>
    )
}

export default ChatManager;
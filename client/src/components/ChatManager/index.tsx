import ChatList from "../ChatList";
import ChatArea from "../ChatArea";
import "./ChatManager.css";
import {useState} from "react";

const ChatManager = () => {
    const [selected, setSelected] = useState<string | null>(null);
    const [update, setUpdate] = useState<boolean>(false);

    const selectChat = (chatId: string) => {
        setSelected(chatId);
    }

    const updateManager = () => {
        setUpdate(!update);
    }

    return (
        <div className={"chat-manager"}>
            <ChatList selectChat={selectChat} updateChatList={update}/>
            <ChatArea chat={selected} updateCallback={updateManager}/>
        </div>
    )
}

export default ChatManager;
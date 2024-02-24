import {useState, KeyboardEvent} from "react";

type MessageBoxProps = {
    chat: string;
    messageSentCallback: Function;
}

const MessageBox = ({chat, messageSentCallback}: MessageBoxProps) => {
    const [message, setMessage] = useState<string>("");

    const sendMessage = (chatId: string) => {
        if (message.length === 0)
            return;

        fetch("/api/messages/" + chatId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({message: message}),
        }).then((res) => {
            if (res.status === 200) {
                setMessage("");
                messageSentCallback();
            }
        })
    }

    const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter")
            sendMessage(chat);
    }

    return (
        <div className={"message-box"}>
            <input className={"message-input"} type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                   onKeyDown={handleEnter}/>
            <input type="button" value="Send" onClick={() => sendMessage(chat)}/>
        </div>
    );
}

export default MessageBox;
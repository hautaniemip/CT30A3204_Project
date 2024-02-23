import {Message} from "../../types/chat";

type MessageProps = {
    message: Message;
}
const MessageView = ({message}: MessageProps) => {
    return (
        <div className={message.sentByYou ? "message-out" : "message-in"}>
            <span className={"message"}>{message.content}</span>
        </div>
    )
}

export default MessageView;
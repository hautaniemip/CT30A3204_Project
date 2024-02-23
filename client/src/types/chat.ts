export type Chat = {
    name: string;
    time: string | null;
    sender: string | null
    message: string | null;
}

export type Message = {
    id: string;
    content: string;
    sentByYou: boolean;
}
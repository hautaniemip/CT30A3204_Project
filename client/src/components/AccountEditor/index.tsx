import {useEffect, useState} from "react";
import {AuthProvider} from "../AuthProvider";
import "./AccountEditor.css"

const AccountEditor = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        fetch("/api/users/" + AuthProvider.id).then((res) => {
            if (res.status !== 200)
                return;
            return res.json();
        }).then((data) => {
            setName(data.name);
            setEmail(data.email);
            setStatus(data.status);
        });
    }, []);

    const updateProfile = () => {
        fetch("/api/users/edit", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, email, status}),
        });
    }

    return (
        <div className={"editor"}>
            <label>
                Name: <input name="name" value={name} onChange={(e) => setName(e.target.value)}/>
            </label>
            <label>
                Email: <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email"/>
            </label>
            <label htmlFor={"status"}>Status:</label>
            <textarea name={"status"} id={"status"} value={status}
                      onChange={(e) => setStatus(e.target.value)}></textarea>
            <button type="submit" onClick={updateProfile}>
                Save
            </button>
        </div>
    );
}

export default AccountEditor;
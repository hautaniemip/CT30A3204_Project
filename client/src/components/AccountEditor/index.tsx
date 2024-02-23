import {useEffect, useState} from "react";
import {AuthProvider} from "../AuthProvider";

const AccountEditor = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        fetch("/api/users/" + AuthProvider.id).then((res) => {
            if (res.status !== 200)
                return;
            return res.json();
        }).then((data) => {
            setName(data.name);
            setEmail(data.email);
        });
    }, []);

    const updateProfile = () => {
        fetch("/api/users/edit", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, email}),
        });
    }

    return (
        <div>
            <label>
                Name: <input name="name" value={name} onChange={(e) => setName(e.target.value)}/>
            </label>{" "}
            <label>
                Email: <input name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </label>{" "}
            <button type="submit" onClick={updateProfile}>
                Save
            </button>
        </div>
    );
}

export default AccountEditor;
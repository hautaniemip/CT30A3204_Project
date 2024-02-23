import {useEffect, useState} from "react";
import {User} from "../../types/user";

const MatchPage = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetch("/api/users/random").then((res) => {
            if (res.status !== 200)
                return;
            return res.json();
        }).then((data) => setUser(data));
    }, []);

    const likeUser = (id: string) => {
        fetch("/api/users/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: id}),
        });
    }

    return (
        <>
            <h3>Find matches</h3>
            {user && user.id !== "0" && <span onClick={() => likeUser(user.id)}>{user.name}</span>}
            {user && user.id === "0" && <span>No new users</span>}
        </>
    );
}

export default MatchPage;
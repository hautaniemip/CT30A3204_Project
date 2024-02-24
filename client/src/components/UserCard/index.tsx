import {useEffect, useState} from "react";
import {User} from "../../types/user";
import "./UserCard.css";


const UserCard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [match, setMatch] = useState<boolean>(false);

    useEffect(() => {
        setMatch(false);
        getRandomUser();
    }, []);

    const getRandomUser = () => {
        fetch("/api/users/random").then((res) => {
            if (res.status !== 200)
                return;
            return res.json();
        }).then((data) => setUser(data));
    }

    const likeUser = (id: string) => {
        fetch("/api/users/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: id}),
        }).then((res) => {
            if (res.status !== 200)
                return;
            return res.json();
        }).then((data) => {
            setMatch(data.matchFound);
            if (!data.matchFound)
                getRandomUser();
        });
    }

    const dislikeUser = (id: string) => {
        fetch("/api/users/dislike", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: id}),
        }).then(() => getRandomUser());
    }

    return (
        <>
            {user && user.id === "0" && <span>No new users</span>}
            {user && user.id !== "0" &&
                <div className={"user-card"}>
                    <p className={"card-name"}>{user.name}</p>
                    <div className={"card-status"}>
                        <p>{!match ? user.status : "Match found! Go to 'Chats' to start chating"}</p></div>
                    <div className={"card-buttons"}>
                        <input type="button" value="Dislike" onClick={() => dislikeUser(user.id)}
                               disabled={match}></input>
                        <input type="button" value="Like" onClick={() => likeUser(user.id)} disabled={match}></input>
                    </div>
                </div>}
        </>
    );
}

export default UserCard;
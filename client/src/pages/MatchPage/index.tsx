import UserCard from "../../components/UserCard";
import NavBar from "../../components/NavBar";

const MatchPage = () => {
    return (
        <>
            <NavBar/>
            <div className={"sub-header"}>
                <h3>Find matches</h3>
            </div>
            <UserCard/>
        </>
    );
}

export default MatchPage;
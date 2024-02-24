import AccountEditor from "../../components/AccountEditor";
import NavBar from "../../components/NavBar";

const AccountPage = () => {


    return (
        <>
            <NavBar/>
            <div className={"sub-header"}>
                <h3>Account</h3>
            </div>
            <AccountEditor/>
        </>
    );
}

export default AccountPage;
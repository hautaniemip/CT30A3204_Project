import {Link} from "react-router-dom";

const NavBar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to={"/"}>Chats</Link>
                </li>
                <li>
                    <Link to={"/matches"}>Matches</Link>
                </li>
                <li>
                    <Link to={"/account"}>Account</Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;
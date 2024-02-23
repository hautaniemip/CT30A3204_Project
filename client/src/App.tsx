import './App.css';
import LoginPage from "./pages/LoginPage";
import {AuthProvider} from "./components/AuthProvider";
import {createBrowserRouter, Link, LoaderFunctionArgs, Outlet, redirect, RouterProvider} from "react-router-dom";
import HomePage from "./pages/HomePage";
import {AuthStatus} from "./components/AuthStatus";
import MatchPage from "./pages/MatchPage";
import AccountPage from "./pages/AccountPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
    return (
        <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>}/>
    );
}

const Title = () => {
    return (
        <>
            <header>
                <h1>Matcher</h1>
                <AuthStatus/>
            </header>
            {AuthProvider.isAuthenticated &&
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
                </nav>}
            <Outlet/>
        </>
    );
}

const protectedLoader = () => {
    if (!AuthProvider.isAuthenticated) {
        return redirect("/login");
    }
    return null;
}

const loginAction = async ({request}: LoaderFunctionArgs) => {
    const formData = await request.formData();
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
        return {
            error: "You must provide email and password to log in",
        };
    }

    try {
        await AuthProvider.login(email, password);
    } catch (error) {
        return {
            error: "Invalid login attempt",
        };
    }

    return redirect("/");
}

const loginLoader = async () => {
    try {
        await AuthProvider.login("", "");
    } catch (err) {
    }
    if (AuthProvider.isAuthenticated) {
        return redirect("/");
    }
    return null;
}

const registerAction = async ({request}: LoaderFunctionArgs) => {
    const formData = await request.formData();
    const name = formData.get("email") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password || !name) {
        return {
            error: "You must provide name, email and password to register",
        };
    }

    try {
        await AuthProvider.register(name, email, password);
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }

    return redirect("/login");
}

const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        loader() {
            // Our root route always provides the user, if logged in
            return {
                user: {
                    isAuthenticated: AuthProvider.isAuthenticated,
                    name: AuthProvider.name,
                    email: AuthProvider.email
                }
            };
        },
        Component: Title,
        children: [
            {
                index: true,
                loader: protectedLoader,
                Component: HomePage,
            },
            {
                path: "matches",
                loader: protectedLoader,
                Component: MatchPage,
            },
            {
                path: "account",
                loader: protectedLoader,
                Component: AccountPage,
            },
            {
                path: "login",
                action: loginAction,
                loader: loginLoader,
                Component: LoginPage,
            },
            {
                path: "register",
                action: registerAction,
                loader: loginLoader,
                Component: RegisterPage,
            },
        ],
    },
    {
        path: "/logout",
        async action() {
            // We signout in a "resource route" that we can hit from a fetcher.Form
            await AuthProvider.logout();
            return redirect("/");
        },
    },
]);


export default App;

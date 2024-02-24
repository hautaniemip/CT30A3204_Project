import './App.css';
import LoginPage from "./pages/LoginPage";
import {AuthProvider} from "./components/AuthProvider";
import {createBrowserRouter, LoaderFunctionArgs, Outlet, redirect, RouterProvider} from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import {AuthStatus} from "./components/AuthStatus";
import MatchPage from "./pages/MatchPage";
import AccountPage from "./pages/AccountPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
    return (
        <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>}/>
    );
}

const Main = () => {
    return (
        <>
            <header>
                <h1>Matcher</h1>
                <AuthStatus/>
            </header>
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
    const name = formData.get("name") as string | null;
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
        Component: Main,
        children: [
            {
                index: true,
                loader: protectedLoader,
                Component: ChatPage,
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
            await AuthProvider.logout();
            return redirect("/");
        },
    },
]);


export default App;

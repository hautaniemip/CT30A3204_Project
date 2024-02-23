import {useFetcher} from "react-router-dom";
import {AuthProvider} from "./AuthProvider";

export const AuthStatus = () => {
    // Get our logged in user, if they exist, from the root route loader data
    let fetcher = useFetcher();

    if (!AuthProvider.isAuthenticated) {
        return <p>You are not logged in.</p>;
    }

    let isLoggingOut = fetcher.formData != null;

    return (
        <>
            <fetcher.Form method="post" action="/logout">
                <button type="submit" disabled={isLoggingOut}>
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                </button>
            </fetcher.Form>
        </>
    );
}
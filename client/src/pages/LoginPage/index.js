import {Form, useActionData, useNavigation} from "react-router-dom";

const LoginPage = () => {
    let navigation = useNavigation();
    let isLoggingIn = navigation.formData?.get("email") != null;

    let actionData = useActionData();
    return (
        <>
            <h2>Login</h2>
            <Form method="post" replace>
                <label>
                    Email: <input name="email"/>
                </label>{" "}
                <label>
                    Password: <input name="password"/>
                </label>{" "}
                <button type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? "Logging in..." : "Login"}
                </button>
                {actionData && actionData.error ? (
                    <p style={{color: "red"}}>{actionData.error}</p>
                ) : null}
            </Form>
        </>
    );
}

export default LoginPage;
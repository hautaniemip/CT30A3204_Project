import {Form, Link, useActionData, useNavigation} from "react-router-dom";

const LoginForm = () => {
    let navigation = useNavigation();
    let isLoggingIn = navigation.formData?.get("email") != null;

    let actionData = useActionData() as { error: string } | undefined;

    return (
        <>
            <Form method="post" replace>
                <label>
                    Email: <input name="email" type="email"/>
                </label>{" "}
                <label>
                    Password: <input name="password" type="password"/>
                </label>{" "}
                <button type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? "Logging in..." : "Login"}
                </button>
                {actionData && actionData.error ? (
                    <p style={{color: "red"}}>{actionData.error}</p>
                ) : null}
            </Form>
            <Link to={"/register"}>Don't have a account yet?</Link>
        </>
    );
}

export default LoginForm;
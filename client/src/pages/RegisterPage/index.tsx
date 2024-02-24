import {Form, useActionData, useNavigation} from "react-router-dom";

const RegisterPage = () => {
    let navigation = useNavigation();
    let isRegistering = navigation.formData?.get("email") != null;

    let actionData = useActionData() as { error: string } | undefined;

    return (
        <>
            <h2>Register</h2>
            <Form method="post" replace>
                <label>
                    Name: <input name="name"/>
                </label>{" "}
                <label>
                    Email: <input name="email" type="email"/>
                </label>{" "}
                <label>
                    Password: <input name="password" type="password"/>
                </label>{" "}
                <button type="submit" disabled={isRegistering}>
                    {isRegistering ? "Registering..." : "Register"}
                </button>
                {actionData && actionData.error ? (
                    <p style={{color: "red"}}>{actionData.error}</p>
                ) : null}
            </Form>
        </>
    );
}

export default RegisterPage;
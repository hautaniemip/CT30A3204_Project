interface AuthProviderInterface {
    isAuthenticated: boolean;
    name: null | string;
    email: null | string;

    login(email: string, password: string): Promise<void>;

    logout(): Promise<void>;
}

export const AuthProvider: AuthProviderInterface = {
    isAuthenticated: false,
    name: null,
    email: null,
    async login(email: string, password: string) {
        await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password}),
        }).then((res) => {
            if (res.status !== 200)
                throw new Error("Invalid login")

            return res.json();
        }).then((data) => {
            AuthProvider.isAuthenticated = true;
            AuthProvider.name = data.name;
            AuthProvider.email = data.email;
        });
    },
    async logout() {
        await new Promise((r) => setTimeout(r, 500));
        AuthProvider.isAuthenticated = false;
        AuthProvider.name = null;
        AuthProvider.email = null;
    },
}
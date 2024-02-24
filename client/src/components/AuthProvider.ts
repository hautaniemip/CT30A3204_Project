interface AuthProviderInterface {
    isAuthenticated: boolean;
    id: null | string;
    name: null | string;
    email: null | string;

    register(name: string, email: string, password: string): Promise<void>;

    login(email: string, password: string): Promise<void>;

    logout(): Promise<void>;
}

export const AuthProvider: AuthProviderInterface = {
    isAuthenticated: false,
    id: null,
    name: null,
    email: null,
    async register(name: string, email: string, password: string) {
        await fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, email, password}),
        }).then((res) => {
            if (res.status !== 200)
                throw new Error("Email already in use")
        });
    },
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
            AuthProvider.id = data.id;
            AuthProvider.name = data.name;
            AuthProvider.email = data.email;
        });
    },
    async logout() {
        await fetch("/api/users/logout", {method: "POST"});
        AuthProvider.isAuthenticated = false;
        AuthProvider.id = null;
        AuthProvider.name = null;
        AuthProvider.email = null;
    },
}
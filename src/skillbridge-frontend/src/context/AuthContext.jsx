import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const storedUser = localStorage.getItem("user");

        return storedUser
            ? JSON.parse(storedUser)
            : null;
    });

    const [accessToken, setAccessToken] = useState(() => {
        return localStorage.getItem("accessToken");
    });

    const login = (userData, token, refreshToken) => {

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "accessToken",
            token
        );

        localStorage.setItem(
            "refreshToken",
            refreshToken
        );

        setUser(userData);
        setAccessToken(token);
    };

    const logout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setUser(null);
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                login,
                logout,
                isAuthenticated: !!user && !!accessToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };
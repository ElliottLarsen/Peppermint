import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import api from "../api/client";
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const { exp } = jwtDecode(token);
                if (exp < Date.now() / 1000) {
                    logout();
                }
            } catch (error) {
                logout();
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        navigate('/home');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => (response),
            (error) => {
                const err = error.response;
                const isUnauthorized = err && err.status === 401;
                if (isUnauthorized) {
                    alert("Expired token");
                    logout();
                }
                return Promise.reject(error);
            }
        );
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>    
    );
};

export const useAuth = () => useContext(AuthContext);


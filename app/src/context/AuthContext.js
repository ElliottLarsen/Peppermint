import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/client";
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
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
                const url = error.config.url;
                console.log(url);
                const isUnauthorized = err && err.status === 401;
                const isProtected = url.includes("/user/");
                if (isUnauthorized && !isProtected) {
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


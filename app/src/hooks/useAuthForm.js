import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleError } from "../app_utilities/HandleError";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export const useAuthForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [ formData, setFormData ] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password1: '', 
        password2: ''
    });

    const[ loginData, setLoginData ] = useState({
            username: "", 
            password: ""
    });

    const handleLogin = async (evt) => {
        evt.preventDefault()
        const params = new URLSearchParams();
        params.append("username", loginData.username);
        params.append("password", loginData.password);
        try {
            const response = await api.post("/user/login", params);
            login(response.data.access_token);
        } catch (error) {
            handleError("Login failed", navigate);
        }
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/user/register`, formData);
            navigate("/login");
        } catch (error) {
            handleError(error, navigate);
        }
    };

    return {
        handleChange,
        handleLogin,
        handleLoginChange,
        handleRegister,
        loginData,
    }
};
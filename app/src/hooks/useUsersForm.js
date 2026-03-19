import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { handleError } from "../app_utilities/HandleError";
import api from "../api/client";

export const useUsersForm = () => {
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(true);
    const [ formData, setFormData ] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password1: '', 
        password2: ''
    });

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await api.get(`/user/`);
            setFormData({
                username: response.data.username,
                email: response.data.email,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                password1: '',
                password2: ''
            });
            setLoading(false);
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/user/', formData);
            alert('User account updated succesfully');
            navigate("/user");
        } catch (error) {
            handleError(error, navigate);
        }
    };

    useEffect(() => { fetchUserData(); }, []);

    return {
        loading,
        formData,
        handleChange,
        handleSubmit,

    };
}
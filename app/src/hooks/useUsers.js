import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "../app_utilities/HandleError";
import api from "../api/client";

export const useUsers = () => {
    const navigate = useNavigate();
    const [ userData, setUserData ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await api.get("/user/");
            setUserData(response.data);
            setLoading(false);
        } catch (error) {
            handleError(error, navigate);
        }
    };

    useEffect(() => { fetchUser(); }, []);

    return {
        userData,
        loading,
    };
};
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { handleError } from "../app_utilities/HandleError";
import api from "../api/client";

export const useAccounts = () => {
    const [ accounts, setAccounts ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    const fetchAccounts = async () => {
        try {
            const response = await api.get('/account/my_accounts');
            setAccounts(response.data || []);
        } catch (error) {
            handleError(error, navigate);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAccounts(); }, []);

    const deleteAccount = async (id) => {
        try {
            await api.delete(`/account/${id}`);
            await fetchAccounts();
            alert('Account deleted!')
        } catch (error) {
            console.error('Error deleting account', error);
        }
    };

    return { accounts, fetchAccounts, deleteAccount, loading };
};
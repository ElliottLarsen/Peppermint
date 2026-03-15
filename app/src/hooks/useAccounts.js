import { useEffect, useState, useMemo } from "react"
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
            const data = response.data || [];
            setAccounts(data);
        } catch (error) {
            handleError(error, navigate);
        } finally {
            setLoading(false);
        }
    };

    const accountOptions = useMemo(() => {
        const options = accounts.map(acct => ({
        key: acct.institution,
        value: acct.id,   
        }));
        return [ {key: "", value: ""},...options];
    }, [accounts])

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

    return { 
        accounts,
        accountOptions, 
        fetchAccounts, 
        deleteAccount, 
        loading };
};
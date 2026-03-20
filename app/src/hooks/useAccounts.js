import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom";
import { handleError } from "../app_utilities/HandleError";
import api from "../api/client";

export const useAccounts = (accountId = null, options = {
    fetchAll: false,
    fetchDetails: false,
    fetchAnalytics: false
}) => {
    const [ account, setAccount ] = useState([]);
    const [ accounts, setAccounts ] = useState([]);
    const [ accountTransactions, setAccountTransactions ] = useState([]);
    // six month expense
    const [ expensesData, setExpensesData ] = useState({});
    const [ expenseCategoryData, setExpenseCategoryData ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    const fetchAccount = async (accountId) => {
        if (!accountId) {
            return;
        }
        try {
            const response = await api.get(`/account/${accountId}`);
            setAccount(response.data);
        } catch (error) {
            handleError(error, navigate);
        } finally {
            setLoading(false);
        }
    };

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

    const fetchAccountTransactions = async (accountId) => {
        if (!accountId) {
            return;
        }
        try {
            const response = await api.get(`/account/${accountId}/transactions`);
            setAccountTransactions(response.data);
        } catch (error) {
            handleError(error, navigate);
        } finally {
            setLoading(false);
        }
    };

    const fetchExpensesData = async () => {
        try {
            const response = await api.get(`/account/expenses/six_months`);
            setExpensesData(response.data || {});
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const fetchExpenseCategoryData= async () => {
        try {
            const response = await api.get(`/account/expenses/by_category`);
            setExpenseCategoryData(response.data);
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const accountOptions = useMemo(() => {
        const options = accounts.map(acct => ({
        key: acct.institution,
        value: acct.id,   
        }));
        return [ {key: "", value: ""},...options];
    }, [accounts]);

    useEffect(() => { if (options.fetchDetails && accountId) fetchAccount(accountId); }, [accountId, options.fetchDetails]);
    useEffect(() => { if (options.fetchAll) fetchAccounts(); }, [options.fetchAll]);
    useEffect(() => { if (options.fetchDetails && accountId) fetchAccountTransactions(accountId); }, [accountId]);
    useEffect(() => { if (options.fetchAnalytics) {
        fetchExpensesData(); 
        fetchExpenseCategoryData();
        }
    }, [options.fetchAnalytics]);

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
        account,
        accountTransactions,
        accounts,
        expensesData,
        expenseCategoryData,
        accountOptions, 
        fetchAccounts, 
        deleteAccount, 
        loading 
    };
};
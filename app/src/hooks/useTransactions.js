import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom";

import { handleError } from "../app_utilities/HandleError";
import { useAccounts } from "./useAccounts";

import api from "../api/client";

export const useTransactions = () => {
    const navigate = useNavigate();
    const { accounts } = useAccounts();
    const [ transactions, setTransactions ] = useState([]);
    const [ accountOptions, setAccountOptions ] = useState()

    const fetchAccountOptions = () => {
        accounts.map(acct => ({
            key: acct.institution,
            value: acct.id,   
    }));
        setAccountOptions([
            {key: "", value: ""},
             ...accounts
        ]);
    };

    const fetchAllTransactions = async () => {
        try {
            const response = await api.get('/account/all_transactions');
            const data = response.data
            if (data.length === 0 || data === null) {
                // alert('No Transactions available at this time');
                setTransactions([]);
            } else {
                setTransactions(data);
            }
        } catch (error) {
            handleError(error, navigate);
        }
    };

    useEffect(() => {fetchAllTransactions();}, []);

    const deleteTransaction = async (account_id, id) => {
        try {
            await api.delete(`/${account_id}/${id}`);
            await fetchAllTransactions();
            alert('Transaction deleted!')
        } catch (error) {
            handleError(error, navigate);
        }
    };

    return {
        accountOptions,
        transactions,
        fetchAllTransactions,
        deleteTransaction, 
    };
};
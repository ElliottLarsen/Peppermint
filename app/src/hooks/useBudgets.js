import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "../app_utilities/HandleError";
import api from "../api/client";

export const useBudgets = () => {
    const navigate = useNavigate();
    const [ budgets, setBudgets ] = useState([]);
    const [ currentBalances, setCurrentBalances ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => { fetchBudgets(); }, []);

    useEffect(() => { fetchCurrentBalances(); }, []);

    const fetchBudgets = async () => {
        try {
            const response = await api.get('/budget/my_budgets');
            setBudgets(response.data || []);
        } catch (error) {
            handleError(error, navigate);
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentBalances = async () => {
        try {
            const cbResponse = await api.get('/budget/current_balances');
            setCurrentBalances(cbResponse.data || []);
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const handleDeleteBudget = async (id) => {
        try {
            await api.delete(`/budget/${id}`);
            await fetchBudgets();
            alert('Budget deleted!')
        } catch (error) {
            handleError(error, navigate);
        }
    };

    return {
        fetchBudgets,
        fetchCurrentBalances,
        handleDeleteBudget,
        budgets,
        currentBalances,
        loading,
    };

}
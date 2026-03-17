import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../api/client";
import { handleError } from "../app_utilities/HandleError";

export const useBudgetsForm = (budgetId, httpType, refreshBudgets, setIsActive) => {
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(true);
    const [ selectedCategory, setSelectedCategory ] = useState("");
    // const [ isActive, setIsActive ] = useState("budgetsHome");
    const [ formData, setFormData ] = useState({
        budget_category: '',
        budget_amount: ''
    });



    useEffect(() => {
        if (httpType === 'put') {
            fetchBudgetData(budgetId);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchBudgetData = async (budgetId) => {
        try {
            const response = await api.get(`/budget/${budgetId}`);
            const data = response.data
            setSelectedCategory(data.budget_category)
            setFormData({
                budget_category: data.budget_category,
                budget_amount: data.budget_amount
            });
            setLoading(false);
        } catch (error) {
            handleError(error, navigate);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault()
        try {

            await api.post("/budget/", formData);
            setFormData({
                budget_category: '',
                budget_amount: ''
            });
            alert("Budget added successfully!")
            setIsActive('budgetsHome');
            refreshBudgets();
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.put(`/budget/${budgetId}`, formData);
            alert('Budget updated successfully!');
            fetchBudgetData(budgetId);
            refreshBudgets();
            setIsActive('budgetsHome');
        } catch (error) {
            handleError(error, navigate);
        }
    };

    return {
        fetchBudgetData,
        handleChange,
        handleAddSubmit,
        handleEditSubmit,
        selectedCategory,
        formData,
        loading,
    }

};
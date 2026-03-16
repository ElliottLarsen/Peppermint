import { useState, useEffect } from "react";
import { adjustTransactionAmount } from "../components/AdjustTransactionAmount";

const TRANSACTION = {
    transaction_date: '',
    transaction_description: '',
    transaction_category: '',
    transaction_amount: '',
};

export const useTransactionsForm = (submitAction, initialData = null) => {
    const [ formData, setFormData ] = useState(TRANSACTION);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                transaction_amount: Math.abs(initialData.transaction_amount || 0)
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name] : value
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        try{
            const adjustedData = {
                ...formData,
                transaction_amount: adjustTransactionAmount(
                    formData.transaction_category,
                    formData.transaction_amount
                ),
            };
            await submitAction(adjustedData);
        } catch (err) {
            setError(err.message || "Error occurred");
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, handleSubmit, loading, error, setFormData }
};


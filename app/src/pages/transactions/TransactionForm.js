import { useNavigate, useParams } from "react-router-dom";
import { useAccounts } from "../../hooks/useAccounts";
import { useEffect, useState } from "react";
import { useTransactionsForm } from "../../hooks/useTransactionsForm";

import Form from "./Form";
import api from "../../api/client";

const initialData = {
    transaction_date: '',
    transaction_description: '',
    transaction_category: '',
    transaction_amount: '',
};

export const TransactionForm = () => {
    const { accountId, transactionId } = useParams();
    const { accountOptions } = useAccounts();
    const [ selectedAccount, setSelectedAccount ] = useState("");
    const [ transactionData, setTransactionData ] = useState(initialData);
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();
    const editMode = Boolean(transactionId);

    const handleAccountSelect = (evt) => {
        setSelectedAccount(evt.target.value);
    };

    const handleFormAction = async (data) => {
        try {
            if (editMode) {
                await api.put(`/${accountId}/${transactionId}`, data);
                alert('Transaction updated successfully');
            } else {
                await api.post(`/${selectedAccount}`, data);
                alert("Transaction added succesfully!");
            }
            navigate("/transactions");  
        } catch (err) {
            console.error("Form error", err);
        }
    };

    const { formData, handleChange, handleSubmit } = useTransactionsForm(handleFormAction, transactionData)

    useEffect(() => {
        if (editMode) {
            const fetchTransaction = async () => {
                try{
                    const response = await api.get(`/${accountId}/${transactionId}`);
                    setTransactionData(response.data);
                    setLoading(false);
                } catch (err) {
                    alert("Failed to load transaction");
                    navigate("/transactions");
                }
            };
            fetchTransaction();
        }
    }, [editMode, accountId, transactionId]);

    return (
        <Form
            editMode={editMode}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleAccountSelect={handleAccountSelect}
            selectedAccount={selectedAccount}
            formData={formData}
            accountOptions={accountOptions}
        />
    );
};

export default TransactionForm;
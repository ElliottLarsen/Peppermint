import { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../../app_utilities/TransactionCategories';

import api from '../../api/client';
import { useTransactionsForm } from '../../hooks/useTransactionsForm';

export default function EditTransaction() {
    const navigate = useNavigate();
    const { accountId, transactionId } = useParams();

    const [transactionData, setTransactionData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => { fetchTransactionData(); }, [accountId, transactionId]);

    const fetchTransactionData = async () => {
        const response = await api.get(`/${accountId}/${transactionId}`);
        setTransactionData(response.data);
        setLoading(false);
    };

    const handleCategorySelect = (e) => {
        const selectedValue = e.target.value;
        setSelectedCategory(selectedValue);
        setTransactionData({
            ...formData,
            transaction_category: selectedValue,
        });
    }

    const handleUpdate = async (data) => {
        await api.put(`/${accountId}/${transactionId}`, data);
        alert('Transaction updated successfully');
        navigate("/transactions");  
    };

    const { formData, handleChange, handleSubmit } = useTransactionsForm(handleUpdate, transactionData);

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    if (error) {
        return <div><p>Error: {error}</p></div>;
    }

    if (!transactionData) {
        return <div><p>No transaction info available.</p></div>;
    }


    return (
        <>
        <div>
            <h3>Edit Transaction</h3>
        </div>
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>

                    <label htmlFor='transaction_date' className='required'>Date </label>
                    <input type='datetime-local' name='transaction_date' value={formData.transaction_date} id='transaction_date'
                    onChange={handleChange} required />

                    <label htmlFor='transaction_description'>Description: </label>
                    <input type='text' name='transaction_description' value={formData.transaction_description} id='transaction_description'
                    onChange={handleChange} required />

                    <label htmlFor='transaction_category'>Category:</label>
                    <select id='transaction_category' value={selectedCategory} onChange={handleCategorySelect}>
                        { categories.map((category) => (
                            <option key={ category.value } value={ category.value }>
                                { category.key }
                            </option>
                    ))}
                    </select>

                    <label htmlFor='transaction_amount' className='required'>Amount:</label>
                    <input type="number" min="0" step="0.01" name="transaction_amount" value={formData.transaction_amount} id='transaction_amount'
                    onChange={handleChange} required/>
                    
                    <button type="submit">Save</button>
                </fieldset>
            </form>
        </div>
        </>
    )
};
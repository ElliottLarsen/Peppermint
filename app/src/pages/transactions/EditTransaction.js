import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../../components/TransactionCategories';
import FetchAccounts from '../../components/FetchAccounts';
import { adjustTransactionAmount } from '../../components/AdjustTransactionAmount';

export default function EditTransaction() {
    const { accountId, transactionId } = useParams();
    const [transactionData, setTransactionData] = useState(null);
    const [accountOption, setAccountOption] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        transaction_date: '',
        transaction_description: '',
        transaction_category: '',
        transaction_amount: '',
    });

    const navigate = useNavigate();
    
    

    useEffect(() => {
        const fetchTransactionData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8000/peppermint/${accountId}/${transactionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                
            });

            setTransactionData(response.data);
            setSelectedAccount(accountId);
            setFormData({
                account_id: selectedAccount,
                transaction_date: response.data.transaction_date,
                transaction_description: response.data.transaction_description,
                transaction_category: response.data.transaction_category,
                transaction_amount: response.data.transaction_amount
            });
            setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchTransactionData();
    }, [accountId, transactionId]);

    const handleAccountSelect = (evt) => {
        setSelectedAccount(evt.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const adjustedFormData = {
                ...formData,
                transaction_amount: adjustTransactionAmount(
                    formData.transaction_category,
                    formData.transaction_amount
                ),
            };
            const token = localStorage.getItem('token');
            await axios.put(`http://127.0.0.1:8000/peppermint/${accountId}/${transactionId}`, adjustedFormData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Transaction updated successfully');
            navigate("/transactions");  
        } catch (error) {
            console.error('Error updating transaction: ', error);
        }
    };

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
                    <label htmlFor='account_id'>Account</label>
                    <FetchAccounts 
                        setAccountOption={setAccountOption}
                        />
                    <select id="account_id" value={selectedAccount} onChange={handleAccountSelect}>
                    { accountOption && accountOption.map((account) => (
                        <option key={ account.value } value={ account.value }>
                            { account.key }
                        </option>
                    ))}
                    </select>

                    <label htmlFor='transaction_date' className='required'>Date </label>
                    <input type='datetime-local' name='transaction_date' value={formData.transaction_date} id='transaction_date'
                    onChange={handleChange} required />

                    <label htmlFor='transaction_description'>Description: </label>
                    <input type='text' name='transaction_description' value={formData.transaction_description} id='transaction_description'
                    onChange={handleChange} required />

                    <label htmlFor='transaction_category'>Category:</label>
                    <select name='transaction_category' id='transaction_category' onChange={handleChange}>
                        <option value={formData.transaction_category} selected></option>
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
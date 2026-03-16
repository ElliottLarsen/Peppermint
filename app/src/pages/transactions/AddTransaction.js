import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { categories } from '../../app_utilities/TransactionCategories';
import { handleError } from '../../app_utilities/HandleError';

import { useAccounts } from '../../hooks/useAccounts';
import { useTransactionsForm } from '../../hooks/useTransactionsForm';
import api from '../../api/client';

export default function AddTransaction() {
    const navigate = useNavigate();

    const [selectedAccount, setSelectedAccount] = useState("");
    const [addNewTransaction, setNewTransaction] = useState({
        transaction_date: '',
        transaction_description: '',
        transaction_category: '',
        transaction_amount: '',
    });

    const { accountOptions } = useAccounts();

    const handleAdd = async (data) => {
        await api.post(`/${selectedAccount}`, data);
        alert("Transaction added succesfully!");
        navigate("/transactions");
    };

    const {formData, handleChange, handleSubmit } = useTransactionsForm(handleAdd, addNewTransaction);

    const handleAccountSelect = (evt) => {
        setSelectedAccount(evt.target.value);
    };

    return (
        <>
        <div>
            <h3>Add New Transaction</h3>
        </div>
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor='account_id'>Account</label>
                    <select id="account_id" value={selectedAccount} onChange={handleAccountSelect} required>
                    { accountOptions && accountOptions.map((account) => (
                        <option key={ account.value } value={ account.value }>
                            { account.key }
                        </option>
                    ))}
                    </select>

                    <label htmlFor='transaction_date' className='required'>Date </label>
                    <input type='datetime-local' name='transaction_date' id='transaction_date'
                    onChange={handleChange} required />

                    <label htmlFor='transaction_description'>Description: </label>
                    <input type='text' name='transaction_description' placeholder='description' id='transaction_description'
                    onChange={handleChange} required />

                    <label htmlFor='transaction_category'>Category:</label>
                    <select name='transaction_category' id='transaction_category' onChange={handleChange}>
                        <option value="" selected></option>
                        { categories.map((category) => (
                            <option key={ category.value } value={ category.value }>
                                { category.key }
                            </option>
                    ))}
                    </select>

                    <label htmlFor='transaction_amount' className='required'>Amount:</label>
                    <input type="number" min="0" step="0.01" name="transaction_amount" placeholder='0.00' id='transaction_amount'
                    onChange={handleChange} required/>
                    
                    <button type="submit">Add</button>
                </fieldset>
            </form>
        </div>
        </>
    )
};

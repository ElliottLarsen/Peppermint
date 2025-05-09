import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { adjustTransactionAmount } from '../../components/AdjustTransactionAmount';
import { categories } from '../../app_utilities/TransactionCategories';
import { handleError } from '../../app_utilities/HandleError';

export default function AddTransaction() {
    const getToken = () => localStorage.getItem('token');
    const navigate = useNavigate();

    const [accountOption, setAccountOption] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [addNewTransaction, setNewTransaction] = useState({
        transaction_date: '',
        transaction_description: '',
        transaction_category: '',
        transaction_amount: '',
    });

    useEffect(() => {
        fetchAccounts();
    }, []);
    
    const fetchAccounts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/peppermint/account/my_accounts", {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
            });
            const accounts = response.data.map((account) => ({
                    key: account.institution,
                    value: account.id,   
            }));
            setAccountOption([
                {key: "", value: ""},
                ...accounts
            ])
            
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault()
        try {
            const adjustedTransaction = {
                ...addNewTransaction,
                transaction_amount: adjustTransactionAmount(
                    addNewTransaction.transaction_category,
                    addNewTransaction.transaction_amount
                ),
            };
            await axios.post(`http://127.0.0.1:8000/peppermint/${selectedAccount}`, adjustedTransaction, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        setNewTransaction({
            transaction_date: '',
            transaction_description: '',
            transaction_category: '',
            transaction_amount: '',
        });
        alert("Transaction added succesfully!")
        navigate("/transactions")
        } catch (error) {
            console.error("Error adding transactions.", error);
        }
    };

    const handleTransactionChange = e => {
        const { name, value } = e.target;
        setNewTransaction({
            ...addNewTransaction,
            [name]: value
        });
    };

    const handleAccountSelect = (evt) => {
        setSelectedAccount(evt.target.value);
    };

    return (
        <>
        <div>
            <h3>Add New Transaction</h3>
        </div>
        <div>
            <form onSubmit={handleTransactionSubmit}>
                <fieldset>
                    <label htmlFor='account_id'>Account</label>
                    <select id="account_id" value={selectedAccount} onChange={handleAccountSelect} required>
                    { accountOption && accountOption.map((account) => (
                        <option key={ account.value } value={ account.value }>
                            { account.key }
                        </option>
                    ))}
                    </select>

                    <label htmlFor='transaction_date' className='required'>Date </label>
                    <input type='datetime-local' name='transaction_date' id='transaction_date'
                    onChange={handleTransactionChange} required />

                    <label htmlFor='transaction_description'>Description: </label>
                    <input type='text' name='transaction_description' placeholder='description' id='transaction_description'
                    onChange={handleTransactionChange} required />

                    <label htmlFor='transaction_category'>Category:</label>
                    <select name='transaction_category' id='transaction_category' onChange={handleTransactionChange}>
                        <option value="" selected></option>
                        { categories.map((category) => (
                            <option key={ category.value } value={ category.value }>
                                { category.key }
                            </option>
                    ))}
                    </select>

                    <label htmlFor='transaction_amount' className='required'>Amount:</label>
                    <input type="number" min="0" step="0.01" name="transaction_amount" placeholder='0.00' id='transaction_amount'
                    onChange={handleTransactionChange} required/>
                    
                    <button type="submit">Add</button>
                </fieldset>
            </form>
        </div>
        </>
    )
}

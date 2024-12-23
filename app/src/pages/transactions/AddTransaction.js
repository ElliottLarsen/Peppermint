import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddTransaction() {
    const [addNewTransaction, setNewTransaction] = useState({
        transaction_date: '',
        transaction_description: '',
        transaction_category: '',
        transaction_amount: '',
    })

    const navigate = useNavigate();
    
    // will need to fetch account_id and be able to choose which 
    // account id the transaction goes into

    const handleTransactionSubmit = async (account_id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:8000/peppermint/${account_id}/`, addNewTransaction, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setNewTransaction({
            transaction_date: '',
            transaction_description: '',
            transaction_category: '',
            transaction_amount: '',
        })
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
    return (
        <>
        <div>
            <h3>Add New Transaction</h3>
        </div>
        <div>
            <form onSubmit={handleTransactionSubmit(account_id)}>
                <fieldset>
                    <label htmlFor='transaction_date' className='required'>Date </label>
                    <input type='date' name='transaction_date' id='transaction_date'
                    onChange={handleTransactionChange} required />

                    <label htmlFor='transaction_description'>Description: </label>
                    <input type='text' name='transaction_description' placeholder='description' id='transaction_description'
                    onChange={handleTransactionChange} required />

                    <label htmlFor='transaction_category'>Category:</label>
                    <select name='transaction_category' id='transaction_category'>
                        <option value="misc" selected>Misc.</option>
                        <option value="auto-transport">Auto & Transportation</option>
                        <option value="gas">Gas</option>
                        <option value="groceries">Groceries</option>
                        <option value="food-restaurants">Food & Restaurants</option>
                        <option value="bills-utilities">Bills % Utilities</option>
                        <option value="education">Education</option>
                        <option value="health-fitness">Health & Fitness</option>
                        <option value="fees-charges">Fees & Charges</option>
                        <option value="mortgage-rent">Mortgage & Rent</option>
                        <option value="personal-care">Personal Care</option>
                        <option value="pets">Pets</option>
                        <option value="income">Income</option>
                        <option value="transfer">Transfer</option>
                        <option value="shopping">Shopping</option>
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

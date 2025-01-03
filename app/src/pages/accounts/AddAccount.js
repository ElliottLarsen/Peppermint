import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { accountCategories } from '../../app_utilities/AccountCategories';

export default function AddAccount() {
    const getToken = () => localStorage.getItem('token');
    const navigate = useNavigate();

    const [addNewAccount, setNewAccount] = useState({
        institution: '',
        account_type: '',
        current_balance: ''
    })

    const handleAccountSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post("http://127.0.0.1:8000/peppermint/account/", addNewAccount, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        setNewAccount({
            institution: '',
            account_type: '',
            current_balance: ''
        });
        alert("Account added successfully!")
        navigate("/accounts")
        } catch (error) {
            console.error('Error adding account', error);
        }
    };

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setNewAccount({
            ...addNewAccount,
            [name]: value
        });
    };

    return (
        <>
        <div>
            <h3>Add New Account</h3>
        </div>
        <div>
            <form onSubmit={handleAccountSubmit}>
                <fieldset>
                    <label htmlFor='institution' className='required'>Institution: </label>
                    <input type='text' name='institution' placeholder='institution' id='institution'
                    onChange={handleAccountChange} required />

                    <label htmlFor='account_type' className='required'>Account type: </label>
                    <select name='account_type' id='account_type' onChange={handleAccountChange}>
                        <option value="" selected></option>
                        { accountCategories.map((category) => (
                            <option key={ category.value } value={ category.value }>
                                { category.key }
                            </option>
                    ))}
                    </select>

                    <label htmlFor='current_balance' className='required'>Current balance</label>
                    <input type="number" min="0" step="0.01" name="current_balance" placeholder='0.00' id='current_balance'
                    onChange={handleAccountChange} required/>
                    
                    <button type="submit">Add</button>
                </fieldset>
            </form>
        </div>
        </>
    )
};
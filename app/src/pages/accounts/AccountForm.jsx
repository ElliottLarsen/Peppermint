import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import axios from "axios";
import { accountCategories } from '../../app_utilities/AccountCategories';

export default function AccountForm({ httpType, account_id, refreshAccounts, setIsActive }) {
    const getToken = () => localStorage.getItem('token');
    const [accountData, setAccountData] = useState(null);
    const [selectedType, setSelectedType] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        institution: '',
        account_type: '',
        current_balance: ''
    });

    useEffect(() => {
        if (httpType === 'put') {
            fetchAccountData(account_id)
        } else {
            setLoading(false);
        }
    }, [account_id])

    const fetchAccountData = async (account_id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/peppermint/account/${account_id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            setAccountData(response.data);
            setSelectedType(response.data.account_type);
            setFormData({
                institution: response.data.institution,
                account_type: response.data.account_type,
                current_balance: response.data.current_balance
            });
            setLoading(false);
        } catch (error) {
            setError(error.message);
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
            await axios.post("http://127.0.0.1:8000/peppermint/account/", formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            setFormData({
                institution: '',
                account_type: '',
                current_balance: ''
            });
            alert("Account added successfully!")
            setIsActive('accountHome');
            refreshAccounts();
        } catch (error) {
            console.error('Error adding account', error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {

            await axios.put(`http://127.0.0.1:8000/peppermint/account/${account_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            alert('Account updated successfully');
            setIsActive('accountHome');
            refreshAccounts();
        } catch (error) {
            console.error('Error updated account: ', error);
        }
    };

    function handleClick() {
        setIsActive('accountHome');
    }

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    if (error) {
        return <div><p>Error: {error}</p></div>;
    }

    if (!accountData && httpType === 'put') {
        return <div><p>No account info available.</p></div>;
    }

    return (
        <>
            <div class='page-title'>
                <h2>{(httpType === 'post') ? 'Add New' : 'Update'} Account</h2>
                <div>
                    <i title="go back">
                        <IoArrowBackCircleOutline
                            onClick={handleClick}
                        />
                    </i>
                </div>
            </div>
            <div>
                <form onSubmit={(httpType === 'post') ? handleAddSubmit : handleEditSubmit}>
                    <fieldset>
                        <label htmlFor='institution' className='required'>Institution: </label>
                        <input type='text' name='institution' value={formData.institution} id='institution'
                            onChange={handleChange} required />


                        <label htmlFor='account_type' className='required'>Account type: </label>
                        <select name='account_type' id='account_type' value={selectedType} onChange={handleChange}>
                            <option value="" selected></option>
                            {accountCategories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.key}
                                </option>
                            ))}
                        </select>

                        <label htmlFor='current_balance' className='required'>Current balance</label>
                        <input type="number" step="0.01" name="current_balance" value={formData.current_balance} id='current_balance'
                            onChange={handleChange} required />

                        <button type="submit">{(httpType === 'post') ? 'Add' : 'Save'}</button>
                    </fieldset>
                </form>
            </div>
        </>
    );
}
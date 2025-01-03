import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { accountCategories } from '../../app_utilities/AccountCategories';

const EditAccount = () => {
    const getToken = () => localStorage.getItem('token');
    const { id } = useParams();
    const navigate = useNavigate();

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
        const fetchAccountData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/peppermint/account/${id}`, {
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
        fetchAccountData();
    }, [id]);

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
           
            await axios.put(`http://127.0.0.1:8000/peppermint/account/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            alert('Account updated successfully');
            navigate("/accounts");  
        } catch (error) {
            console.error('Error updated account: ', error);
        }
    };

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    if (error) {
        return <div><p>Error: {error}</p></div>;
    }

    if (!accountData) {
        return <div><p>No account info available.</p></div>;
    }

    return (
        <>
        <div class='page-title'>
            <h2>Update Account Information</h2>
        </div>
        <div>
         <form onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor='institution' className='required'>Institution: </label>
                    <input type='text' name='institution' value={formData.institution} id='institution'
                    onChange={handleChange} required />


                    <label htmlFor='account_type' className='required'>Account type: </label>
                    <select name='account_type' id='account_type' value={selectedType} onChange={handleChange}>
                        <option value="" selected></option>
                        { accountCategories.map((category) => (
                            <option key={ category.value } value={ category.value }>
                                { category.key }
                            </option>
                    ))}
                    </select>

                    <label htmlFor='current_balance' className='required'>Current balance</label>
                    <input type="number" step="0.01" name="current_balance" value={formData.current_balance} id='current_balance'
                    onChange={handleChange} required/>
                    
                    <button type="submit">Save</button>
                </fieldset>
            </form>
        </div>
        </>
    );
};

export default EditAccount;

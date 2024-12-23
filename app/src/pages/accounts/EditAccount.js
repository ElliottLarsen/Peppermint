import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditAccount = () => {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        institution: '',
        account_type: '',
        current_balance: ''
    });

    const { id } = useParams();
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8000/peppermint/account/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAccountData(response.data);
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
            const token = localStorage.getItem('token');
            await axios.put(`http://127.0.0.1:8000/peppermint/account/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
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
                    <input type='text' name='account_type' value={formData.account_type} id='account_type'
                    onChange={handleChange} required />

                    <label htmlFor='current_balance' className='required'>Current balance</label>
                    <input type="number" min="0" step="0.01" name="current_balance" value={formData.current_balance} id='current_balance'
                    onChange={handleChange} required/>
                    
                    <button type="submit">Add</button>
                </fieldset>
            </form>
        </div>
        </>
    );
};

export default EditAccount;

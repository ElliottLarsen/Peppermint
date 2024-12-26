import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { MdOutlineEdit, MdAddCircleOutline, MdDeleteOutline } from "react-icons/md";
import FormatCurrency from '../../components/FormatCurrency';

const GetAccounts = () => {
    const navigate = useNavigate();
   
    const [accounts, setAccounts] = useState(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/peppermint/account/my_accounts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAccounts(response.data);
        } catch (error) {
            console.error('Error retrieving accounts.', error);
            if (error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    if (!accounts) {
        return <div><p>No account info available.</p></div>;
    }

    const handleDeleteAccount = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/peppermint/account/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchAccounts();
            alert('Account deleted!')
        } catch (error) {
            console.error('Error deleting account', error);
        }
    };

    return (
        <>
        <div class="page-title">
            <h2>Accounts</h2>
        </div>
        <div class="account-table">
        <div>
        <i class="add-button" title="Add New Account"><MdAddCircleOutline onClick={() => navigate('/accounts/add_account')} /></i>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Institution</th>
                        <th>Account Type</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {accounts.map(account => (
                    <tr key={account.id}>
                        <td>{account.institution}</td>
                        <td>{account.account_type}</td>
                        <td><FormatCurrency amount={account.current_balance}/></td>
                        <td><i class="edit-button" title="Edit Account"><MdOutlineEdit 
                            onClick={() => navigate(`/accounts/edit_account/${account.id}`)} /></i>
                        <i class="delete-button" title="Delete Account"><MdDeleteOutline 
                            onClick={() => handleDeleteAccount(account.id)} /></i></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </div>
        </>
    )
};

export default GetAccounts;

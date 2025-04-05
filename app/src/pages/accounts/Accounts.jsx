import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { MdOutlineEdit, MdAddCircleOutline, MdDeleteOutline } from "react-icons/md";
import FormatCurrency from '../../app_utilities/FormatCurrency';
import { handleError } from '../../app_utilities/HandleError';

import AccountForm from './AccountForm';

export default function GetAccounts() {

    const getToken = () => localStorage.getItem('token');
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState(null);
    const [accountId, setAccountId] = useState();
    const [isActive, setIsActive] = useState('accountHome')

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/peppermint/account/my_accounts', {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            setAccounts(response.data);
        } catch (error) {
            handleError(error, navigate);
        }
    };

    if (!accounts) {
        return <div><p>No account info available.</p></div>;
    }

    const handleDeleteAccount = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/peppermint/account/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            fetchAccounts();
            alert('Account deleted!')
        } catch (error) {
            console.error('Error deleting account', error);
        }
    };

    function handleFormClick(value, account_id) {
        setIsActive(value);
        if (value === 'editAccount') {
            setAccountId(account_id);
        }
    };

    return (
        <>
            <div class="page-title">
                <h2>Accounts</h2>
            </div>
            {(isActive === 'accountHome') ? (
                <div class="account-table">
                    <div>
                        <i class="add-button" title="Add New Account"><MdAddCircleOutline onClick={() => handleFormClick('addAccount')} /></i>
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
                                        <td><FormatCurrency amount={account.current_balance} /></td>
                                        <td><i class="edit-button" title="Edit Account"><MdOutlineEdit
                                            onClick={() => handleFormClick('editAccount', account.id)} /></i>
                                            <i class="delete-button" title="Delete Account"><MdDeleteOutline
                                                onClick={() => handleDeleteAccount(account.id)} /></i></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            ) : ((isActive === 'editAccount') ? (
                <AccountForm 
                httpType={'put'}
                account_id={accountId} 
                setIsActive={setIsActive}
                />

            ) : (
                <AccountForm 
                httpType={'post'} 
                refreshAccounts={fetchAccounts}
                setIsActive={setIsActive}
                />
            ))}
        </>
    )
};

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdAddCircleOutline } from "react-icons/md";
import { handleError } from '../../app_utilities/HandleError';

import AccountsDisplay from './AccountsDisplay';
import AccountForm from './AccountForm';

export default function GetAccounts() {
    const getToken = () => localStorage.getItem('token');
    const [accounts, setAccounts] = useState(null);
    const [accountId, setAccountId] = useState();
    const [isActive, setIsActive] = useState('accountHome')
    const navigate = useNavigate();

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
            <div className="page-title">
                <h2>Accounts</h2>
            </div>
            {(isActive === 'accountHome') ? (
                <div className="account-table">
                    <div>
                        <i className="add-button" title="Add New Account">
                            <MdAddCircleOutline onClick={() => handleFormClick('addAccount')} />
                        </i>
                    </div>
                    <div>
                        <AccountsDisplay
                            accounts={accounts}
                            handleFormClick={handleFormClick}
                            handleDeleteAccount={handleDeleteAccount}
                        />
                    </div>
                </div>
            ) : ((isActive === 'editAccount') ? (
                <AccountForm
                    httpType={'put'}
                    account_id={accountId}
                    refreshAccounts={fetchAccounts}
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

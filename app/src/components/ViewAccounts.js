import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import FormatCurrency from '../app_utilities/FormatCurrency';

const ViewAccounts = () => {
    const [accounts, setAccounts] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
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
        fetchAccounts();
    }, []);

    if (!accounts) {
        return <div><p>No account info available.</p></div>;
    }

    return (
        <>
        <div>
            <div class="account-col">
                {accounts.map(account => (
                    <div class="acct-box" key={account.id}>
                        <div class="acct-detail" title="Account Details" onClick={() => navigate(`/accounts/${account.id}`)}>{account.institution}</div>
                        <div class="curr-balance">
                        <FormatCurrency amount={account.current_balance}/>
                        </div> 
                    </div>
                ))}
            </div>
        </div>
        </>
    )
};

export default ViewAccounts;
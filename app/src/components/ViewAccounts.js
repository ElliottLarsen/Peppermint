import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

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
            <ul>
                {accounts.map(account => (
                    <li key={account.id}>
                        <p>{account.institution}</p>
                        <p>{account.account_type}</p>
                        <p>{account.current_balance}</p>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
};

export default ViewAccounts;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FetchAccounts = ({ setAccountOption }) => {
    const navigate = useNavigate();
    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://127.0.0.1:8000/peppermint/account/my_accounts", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            });
            const accounts = response.data.map((account) => ({
                    key: account.institution,
                    value: account.id,   
            }));
            setAccountOption([
                {key: "", value: ""},
                ...accounts
            ])
            
        } catch (error) {
            console.error('Error retrieving accounts.', error);
            if (error.response.status === 401) {
                navigate('/login');
            } else {
                console.error('Error with request: ', error.message);
            }
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return null;
};

export default FetchAccounts;
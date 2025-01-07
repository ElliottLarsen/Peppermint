import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ViewAccounts from '../../components/ViewAccounts';
import ExpensesBarGraph from '../../components/ExpensesBarGraph';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../../app_utilities/HandleError';

const LandingPage = () => {
    const getToken = () => localStorage.getItem('token');
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [expensesData, setExpensesData]= useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/peppermint/user/', {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                });
                setUsername(response.data.username);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchUserName();
    }, []);

    useEffect(() => {
        const fetchExpensesData = async () => {
            const getToken = () => localStorage.getItem('token');
            try {
                const response = await axios.get(`http://127.0.0.1:8000/peppermint/account/expenses/six_months`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                });
                setExpensesData(response.data);
        
            } catch (error) {
                handleError(error, navigate);
            }
        };
        fetchExpensesData();
    }, [navigate]);

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    if (error) {
        return <div><p>Error: {error}</p></div>;
    }

    if (!username) {
        return <div><p>No user info available.</p></div>;
    }


    return (
        <>
        <div class="page-title">
            <h2>Welcome back, {username}!</h2>
        </div>
        <div class="user-landing">
            <div class='account-card'>
                <ViewAccounts />
            </div>
            <div class='expenses-card'>
               {expensesData ? <ExpensesBarGraph expensesData={expensesData} /> : <p>Loading...</p>}
            </div>
        </div>
        </>
    )
};

export default LandingPage;
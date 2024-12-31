import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ViewAccounts from '../../components/ViewAccounts';

const LandingPage = () => {
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/peppermint/user/', {
                    headers: {
                        Authorization: `Bearer ${token}`
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
            </div>
        </div>
        </>
    )
};

export default LandingPage;
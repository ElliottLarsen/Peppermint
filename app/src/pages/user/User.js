import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { MdOutlineEdit } from "react-icons/md";
import ViewAccounts from '../../components/ViewAccounts';

const Profile = () => {
    const [userData, setUserData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        const navigate = useNavigate();
        
        useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://127.0.0.1:8000/peppermint/user/', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUserData(response.data);
                    setLoading(false);
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                }
            };
            fetchUserData();
        }, []);

        if (loading) {
            return <div><p>Loading...</p></div>;
        }
    
        if (error) {
            return <div><p>Error: {error}</p></div>;
        }
    
        if (!userData) {
            return <div><p>No user info available.</p></div>;
        }

        return (
            <>
            
            <div class="page-title">
                <h2>User Profile</h2>
            </div>
            <div class="user-landing">
            <div class="profile">
                {/* create table? */}
                <p>Username: {userData.username}</p>
                <p>Name: {userData.first_name} {userData.last_name}</p>
                <p>Email: {userData.email}</p>
                <i class="edit-button" alt="Edit User"><MdOutlineEdit onClick={() => navigate('/user/edit')} /></i>
            </div>
            <div class='account-card'>
                <ViewAccounts />
            </div>
            </div>
            </>
        )
};

export default Profile;
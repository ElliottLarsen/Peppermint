import { useNavigate } from 'react-router-dom'
import { MdOutlineEdit } from "react-icons/md";

import { useUsers } from '../../hooks/useUsers';

const Profile = () => {
    const navigate = useNavigate();
    const { userData, loading } = useUsers();

    if (loading) {
        return <div><p>Loading...</p></div>;
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
            </div>
            </>
        )
};

export default Profile;
import { useUsersForm } from '../../hooks/useUsersForm';

const User = () => {
    const {loading, formData, handleChange, handleSubmit} = useUsersForm();

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    if (!formData) {
        return <div><p>No user info available.</p></div>;
    }

    return (
        <>
        <div class="page-title">
            <h2>Update User Profile</h2>
        </div>
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor="username">Username: </label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    
                    <label htmlFor="email">Email: </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    
                    <label htmlFor="first_name">First Name: </label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
                    
                    <label htmlFor="last_name">Last Name: </label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
                    
                    <label htmlFor="password1">New Password: </label>
                    <input type="password" name="password1" value={formData.password1} onChange={handleChange} />
                    
                    <label htmlFor="password2">Confirm New Password: </label>
                    
                    <input type="password" name="password2" value={formData.password2} onChange={handleChange} />
                    <button type="submit">Update</button>
                </fieldset>
            </form>
        </div>
        </>
    );
};

export default User;
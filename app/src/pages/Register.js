import { useAuthForm } from '../hooks/useAuthForm';

export default function Register() {
    const { handleChange, handleRegister } = useAuthForm();

    return (
        <>
        <div class="page-title">
            <h2>Register</h2>
        </div>
        <div>
            <form onSubmit={handleRegister}>
                <fieldset>
                    <label htmlFor="username" className="required">Username: </label>
                    <input type="text" name="username" placeholder="username" id="username" onChange={handleChange} required autofocus />
                
                    <label htmlFor="password1" className="required">Password: </label>
                    <input type="password" name="password1" placeholder="password" id="password1" onChange={handleChange} required />
                   
                    <label htmlFor="password2" className="required">Confirm Password: </label>
                    <input type="password" name="password2" placeholder="confirm password" id="password2" onChange={handleChange} required />
                
                    <label htmlFor="first_name" className="required">First Name: </label>
                    <input type="text" name="first_name" placeholder="first name" id="first_name" onChange={handleChange} required />
                  
                    <label htmlFor="last_name" className="required">Last Name: </label>
                    <input type="text" name="last_name" placeholder="last name" id="last_name" onChange={handleChange} required />
                  
                    <label htmlFor="email" className="required">Email: </label>
                    <input type="text" name="email" placeholder="email" id="email" onChange={handleChange} required />
                
                    <button type="submit">Register</button>
                </fieldset>
            </form>
        </div>
        </>
    )
}
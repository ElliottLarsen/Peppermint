import { useAuthForm } from '../hooks/useAuthForm';

export default function Login() {
    const { loginData, handleLoginChange, handleLogin } = useAuthForm();

    return (
        <>
            <div class="page-title">
                <h2>Login</h2>
            </div>
            <div>
                <form onSubmit={handleLogin}>
                    <fieldset>
                        <label htmlFor="username">username: </label>
                        <input id="username" type="text" placeholder='username' name='username' value={loginData.username} onChange={handleLoginChange} required />
                        
                        <label htmlFor="password">password: </label>
                        <input id='password' type='password' placeholder='password' name='password' value={loginData.password} onChange={handleLoginChange} required />
                        
                        <button type='submit'>login</button>
                    </fieldset>
                </form>
            </div>
        </>
    )
}
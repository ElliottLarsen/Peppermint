import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [loginData, setLoginData] = useState({ username: "", password: ""});
    const { login } = useAuth();

    const handleChange = (evt) => {
        // const changeField = evt.target.name;
        // const newValue = evt.target.value;
        // setLoginData(currData => {
        //     currData[changeField] = newValue;
        //     return { ...currData };
        // })

        const { name, value } = evt.target;
        setLoginData(currData => ({ ...currData, [name]: value }));
    }

    const handleLogin = (evt) => {
        evt.preventDefault()
        const params = new URLSearchParams();
        params.append("username", loginData.username);
        params.append("password", loginData.password);
        axios.post("http://127.0.0.1:8000/peppermint/user/login", params)
            .then((res) => {
                login(res.data.access_token);
            })
            .catch((e) => {
                console.error("Login error", e.response);
                window.alert("Login error!");
            })
    }

    return (
        <>
            <div class="page-title">
                <h2>Login</h2>
            </div>
            <div>
                <form onSubmit={handleLogin}>
                    <fieldset>
                        <label htmlFor="username">username: </label>
                        <input id="username" type="text" placeholder='username' name='username' value={loginData.username} onChange={handleChange} required />
                        
                        <label htmlFor="password">password: </label>
                        <input id='password' type='password' placeholder='password' name='password' value={loginData.password} onChange={handleChange} required />
                        
                        <button type='submit'>login</button>
                    </fieldset>
                </form>
            </div>
        </>
    )
}
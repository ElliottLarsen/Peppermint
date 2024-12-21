import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';

export default function Register() {
    const [registerData, setRegisterData] = useState({ 
        username: "", password1: "", password2: "", first_name: "", last_name: "", email: ""
    })

    const navigateTo = useNavigate();

    const handleSubmit = (evt) => {
        evt.preventDefault();
        axios.post("http://127.0.0.1:8000/peppermint/user/register", registerData)
            .then((res) => {
                navigateTo("/login")
            })
            .catch((e) => {
                console.error("Error registering: ", e);
                window.alert("This user already exists");
            })
    }

    const handleChange = (evt) => {
        const changeField = evt.target.name;
        const newValue = evt.target.value;
        setRegisterData(currData => {
            currData[changeField] = newValue;
            return { ...currData };
        })
    }

    if (registerData) {
        <Login />
    }

    return (
        <>
        <div class="page-title">
            <h2>Register</h2>
        </div>
        <div>
            <form onSubmit={handleSubmit}>
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
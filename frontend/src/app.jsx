import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import './app.css';
import Login from "./components/Login";
import Logout from "./components/Logout";
import Welcome from './components/Welcome';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setisLoggedIn(false);
    };

    return (
        <>
            <header>
                <div>
                    <h1>Peppermint</h1>
                </div>
            </header>
            <nav>
                {isLoggedIn ? (
                    <>
                    <p>links go here</p>
                    <Link to='/logout'>Logout</Link>
                    </>
                
                ) : (
                    <>
                    <Link to="/">Welcome</Link>
                    <Link to="/login">Login</Link>
                    <p>links go here</p>
                    </>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login setisLoggedIn={setIsLoggedIn} />} />
                <Route path="/logout" element={<Logout setisLoggedIn={setIsLoggedIn} />} />
            </Routes>
            <footer>
                <p>&copy;2024</p>
            </footer>
        </>
    );
}

export default App;
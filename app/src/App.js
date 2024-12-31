import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from "./pages/Login";
import Logout from "./components/Logout";
import Register from './pages/Register';
import GetAccounts from './pages/accounts/Accounts';
import AddAccount from './pages/accounts/AddAccount';
import EditAccount from './pages/accounts/EditAccount';
import ViewAccountDetail from './components/AccountDetail';
import GetBudgets from './pages/budgets/Budgets';
import AddBudget from './pages/budgets/AddBudget';
import GetAllTransactions from './pages/transactions/Transactions';
import AddTransaction from './pages/transactions/AddTransaction';
import EditTransaction from './pages/transactions/EditTransaction';
import Profile from './pages/user/User';
import User from './pages/user/EditUser';
import LandingPage from './pages/user/Home';
import Welcome from './pages/Welcome';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <>
        <header>
            <div class="navbar">
            <div>
                <h1>Peppermint</h1>
            </div>
            <div>
                <nav>
                    {isLoggedIn ? (
                        <>
                        <Link to="/home">Home</Link>
                        <Link to="/accounts">Accounts</Link>
                        <Link to="/transactions">Transactions</Link>
                        <Link to="/budgets">Budgets</Link>
                        <Link to='/user'>Profile</Link>
                        <Link to='/logout'>Logout</Link>
                        </>
                    ) : (
                        <>
                        <Link to="/">Home</Link>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                        </>
                    )}
                </nav>
            </div>
            </div>
        </header>
        <main>
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path='/register' element={<Register />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/accounts" element={<GetAccounts />} />
            <Route path="/accounts/:accountId" element={<ViewAccountDetail/>} />
            <Route path="/accounts/add_account" element={<AddAccount />} />
            <Route path="/accounts/edit_account/:id" element={<EditAccount />} />
            <Route path="/budgets" element={<GetBudgets />} />
            <Route path="/budgets/add_budget" element={<AddBudget />} />
            <Route path="/transactions" element={<GetAllTransactions />} />
            <Route path="/transactions/add_transaction/" element={<AddTransaction />} />
            <Route path="/transactions/edit_transaction/:accountId/:transactionId" element={<EditTransaction />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/user" element={<Profile />} /> 
            <Route path="/user/edit" element={<User />} />
            <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
        </main>
        <footer>
            <p>&copy;2024</p>
        </footer>
        </>
    );
}

export default App;
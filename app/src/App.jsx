
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import './App.css';

import Welcome from './pages/Welcome';
import Login from "./pages/Login";
import Register from './pages/Register';

import LandingPage from './pages/user/Home';
import GetAccounts from './pages/accounts/Accounts';
import ViewAccountDetail from './components/AccountDetail';
import GetBudgets from './pages/budgets/Budgets';
import GetAllTransactions from './pages/transactions/Transactions';
import TransactionForm from './pages/transactions/TransactionForm';
import AddTransaction from './pages/transactions/AddTransaction';
import EditTransaction from './pages/transactions/EditTransaction';
import Profile from './pages/user/User';
import User from './pages/user/EditUser';


function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Public */}
                    <Route index element={<Welcome />} />
                    <Route path='register' element={<Register />} />
                    <Route path="login" element={<Login />} />

                    {/* Protected */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="home" element={<LandingPage />} />
                        <Route path="user" element={<Profile />} /> 
                        <Route path="user/edit" element={<User />} />

                        <Route path="accounts" element={<GetAccounts />} />
                        <Route path="accounts/:accountId" element={<ViewAccountDetail/>} />

                        <Route path="budgets" element={<GetBudgets />} />
                        
                        <Route path="transactions/" element={<GetAllTransactions />} />
                        <Route path="transactions/add_transaction" element={<TransactionForm />} />
                        <Route path="transactions/edit_transaction/:accountId/:transactionId" element={<TransactionForm />} />
                       
                    </Route>
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
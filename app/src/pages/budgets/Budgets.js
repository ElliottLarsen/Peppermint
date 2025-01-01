import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { MdOutlineEdit, MdAddCircleOutline, MdDeleteOutline } from "react-icons/md";
import  FormatCurrency  from '../../app_utilities/FormatCurrency';
import { useState, useEffect } from 'react';

const GetBudgets = () => {
    const navigate = useNavigate();

    const [budgets, setBudgets] = useState(null);
    const [currentBalance, setCurrentBalance] = useState();
    const [accounts, setAccounts] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchBudgets();
    }, []);

    // useEffect(() => {
    //     fetchAllTransactions();
    // }, [accounts]);

    const fetchBudgets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/peppermint/budget/my_budgets', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBudgets(response.data);
        } catch (error) {
            console.error('Error retrieving budgets.', error);
            if (error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/peppermint/account/my_accounts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAccounts(response.data);
        } catch (error) {
            console.error('Error retrieving accounts.', error);
            if (error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const getAccountIds = () => accounts.map((account) => account.id);

    const fetchAccountTransactions =  async (account_id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://127.0.0.1:8000/peppermint/account/${account_id}/transactions`, {
                    headers: {
                         Authorization: `Bearer ${token}`
                    }
                });
            return response.data || [];
            
        } catch (error) {
            console.error('Error retrieving accounts.', error);
            if (error.response.status === 401) {
                navigate('/login');
            return [];
            }
        }
    };

    const fetchAllTransactions = async () => {
        try {
            const accountIds = getAccountIds();
            const transactionPromises = accountIds.map(fetchAccountTransactions);
            const transactionArrays = await Promise.all(transactionPromises);
    
            const allTransactions = transactionArrays.flat();
            console.log(allTransactions);
            setTransactions(allTransactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);        
        }
  
    };

    const fetchCurrentBalance = async (budgetCategory) => {
        try {
            if (!transactions.length) {
                await fetchAllTransactions();
            }

            const filteredTransactions = transactions.filter(
                (transaction) => transaction.transaction_category === budgetCategory
            ); 
            const balance = filteredTransactions.reduce((sum, transaction) => sum + transaction.transaction_amount, 0);           
            setCurrentBalance(balance);
        } catch (error) {
            console.error('Error calculating balance:', error);
        }
    };

    const handleDeleteBudget = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/peppermint/budget/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchBudgets();
            alert('Budget deleted!')
        } catch (error) {
            console.error('Error deleting budget', error);
        }
    };

    return (
        <>
        <div class="page-title">
            <h2>Budgets</h2>
        </div>
        <div class="account-table">
        <div>
        <i class="add-button" title="Add New Budget"><MdAddCircleOutline onClick={() => navigate('/budgets/add_budget')} /></i>
        </div>
        <div>
            { !budgets ? (
                <p> No budgets found </p>
            ) : (
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Balance</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {budgets.map(budget => (
                    <tr key={budget.id}>
                        <td>{budget.budget_category}</td>
                        <td>{fetchCurrentBalance(budget.budget_category)}</td>
                        <td><FormatCurrency amount={budget.budget_amount}/></td>
                        <td><i class="edit-button" title="Edit Budget"><MdOutlineEdit 
                            onClick={() => navigate(`/budgets/edit_budgett/${budget.id}`)} /></i>
                        <i class="delete-button" title="Delete Budget"><MdDeleteOutline 
                            onClick={() => handleDeleteBudget(budget.id)} /></i></td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>
        </div>
        
        </>
    );
    
};

export default GetBudgets;
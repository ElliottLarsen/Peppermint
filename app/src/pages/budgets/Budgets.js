import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { MdOutlineEdit, MdAddCircleOutline, MdDeleteOutline } from "react-icons/md";
import  FormatCurrency  from '../../app_utilities/FormatCurrency';
import { useState, useEffect } from 'react';
import { handleError } from '../../app_utilities/HandleError';

const GetBudgets = () => {
    const navigate = useNavigate();
    const getToken = () => localStorage.getItem('token');
    const [budgets, setBudgets] = useState(null);
    const [currentBalance, setCurrentBalance] = useState();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchBudgets();
    }, []);

    useEffect(() => {
        fetchAllTransactions();
    }, []);


    const fetchBudgets = async () => {
        try {
           
            const response = await axios.get('http://127.0.0.1:8000/peppermint/budget/my_budgets', {
                headers: {
                    Authorization: `Bearer ${getToken()}`
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


    const fetchAllTransactions = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/peppermint/account/all_transactions', {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const data = response.data
            console.log("data:", response.data)
            if (data.length === 0) {
                alert('No Transactions available at this time');
                setTransactions([]);
            } else {
                const flattenedTransactions = data.flat()
                const sortedTransactions = flattenedTransactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
                setTransactions(sortedTransactions);
            }
        } catch (error) {
            handleError(error, navigate);
        }
    }

    const calculateCurrentBalance = async (budgetCategory) => {
        const filteredTransactions = transactions.filter(
            (transaction) => transaction.transaction_category === budgetCategory
        ); 
        const balance = filteredTransactions.reduce((sum, transaction) => sum + transaction.transaction_amount, 0);           
        return balance;

    };

    const handleDeleteBudget = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/peppermint/budget/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
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
                        <td>0</td>
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
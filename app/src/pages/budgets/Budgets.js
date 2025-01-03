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
    const [currentBalances, setCurrentBalance] = useState([]);

    useEffect(() => {
        fetchBudgets();
    }, []);

    useEffect(() => {
        fetchCurrentBalances();
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
            handleError(error, navigate);
        }
    };

    const fetchCurrentBalances = async () => {
        try {
            const cbResponse = await axios.get('http://127.0.0.1:8000/peppermint/budget/current_balances', {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            console.log(cbResponse.data)
            setCurrentBalance(cbResponse.data);
        } catch (error) {
            handleError(error, navigate);
        }
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
                        <th>Current Balance</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {budgets.map(budget => (
                    <tr key={budget.id}>
                        <td>{budget.budget_category}</td>
                        <td><FormatCurrency amount={currentBalances[budget.budget_category]}/></td>
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
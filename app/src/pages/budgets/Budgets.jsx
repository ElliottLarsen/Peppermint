import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { MdAddCircleOutline } from "react-icons/md";
import { useState, useEffect } from 'react';
import { handleError } from '../../app_utilities/HandleError';

import BudgetsDisplay from './BudgetsDisplay';
import BudgetForm from './BudgetForm';

export default function GetBudgets() {
    const navigate = useNavigate();
    const getToken = () => localStorage.getItem('token');

    const [budgets, setBudgets] = useState(null);
    const [budgetId, setBudgetId] = useState();
    const [currentBalances, setCurrentBalance] = useState([]);
    const [isActive, setIsActive] = useState('budgetsHome');

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

    function handleFormClick(value, budget_id) {
        setIsActive(value);
        if (value === 'editBudget') {
            setBudgetId(budget_id);
        }
    }

    return (
        <>
            <div className="page-title">
                <h2>Budgets</h2>
            </div>
            {(isActive === 'budgetsHome') ? (
                <div className="account-table">
                    <div>
                        <i className="add-button" title="Add New Budget">
                            <MdAddCircleOutline
                                onClick={() => handleFormClick('addBudget')} />
                        </i>
                    </div>
                    <div>
                        {!budgets ? (
                            <p> No budgets found </p>
                        ) : (
                            <BudgetsDisplay
                                currentBalances={currentBalances}
                                budgets={budgets}
                                handleFormClick={handleFormClick}
                                handleDeleteBudget={handleDeleteBudget}
                            />
                        )}
                    </div>
                </div>
            ) : ((isActive === 'editBudget') ? (
                <BudgetForm
                    httpType={'put'}
                    budget_id={budgetId}
                    refreshBudgets={fetchBudgets}
                    setIsActive={setIsActive}
                />
            ) : (
                <BudgetForm
                    httpType={'post'}
                    refreshBudgets={fetchBudgets}
                    setIsActive={setIsActive}
                />
            ))}
        </>
    );
};
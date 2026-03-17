import { MdAddCircleOutline } from "react-icons/md";
import { useState } from 'react';
import { useBudgets } from '../../hooks/useBudgets';

import BudgetsDisplay from './BudgetsDisplay';
import BudgetForm from './BudgetForm';

export default function GetBudgets() {
    const { fetchBudgets, budgets, currentBalances, handleDeleteBudget } = useBudgets();
    const [budgetId, setBudgetId] = useState();
    const [isActive, setIsActive] = useState('budgetsHome');

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
                        { budgets.length === 0 ? (
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
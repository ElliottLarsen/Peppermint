import { IoArrowBackCircleOutline } from "react-icons/io5";
import { categories } from "../../app_utilities/TransactionCategories";
import { useBudgetsForm } from "../../hooks/useBudgetsForm";

export default function BudgetForm({ httpType, budget_id, refreshBudgets, setIsActive }) {
    const { 
        handleAddSubmit, 
        handleEditSubmit, 
        handleChange, 
        formData, 
        selectedCategory, 
        loading 
    } = useBudgetsForm(budget_id, httpType, refreshBudgets, setIsActive);

    function handleClick() {
        setIsActive('budgetsHome');
    }

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    // if (!budgetData && (httpType === 'put')) {
    //     return <div><p>No budget info available.</p></div>
    // }

    return (
        <>
            <div className="account-table">
            <div className="add-button">
                <i title="go back">
                    <IoArrowBackCircleOutline
                        onClick={handleClick}
                    />
                </i>
            </div>
                <form onSubmit={(httpType === 'post') ? handleAddSubmit : handleEditSubmit}>
                    <fieldset>
                        <legend>
                            <h2>{(httpType === 'post') ? 'Add' : 'Edit'} Budget</h2>
                        </legend>
                        <label htmlFor='budget_category' className='required'>Category: </label>
                        <select name='budget_category' id='budget_category' defaultValue={selectedCategory} onChange={handleChange}>
                            <option value=""></option>
                            {categories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.key}
                                </option>
                            ))}
                        </select>

                        <label htmlFor='budget_amount' className='required'>Amount:</label>
                        <input type="number" min="0" step="0.01" name="budget_amount" value={formData.budget_amount} id='budget_amount'
                            onChange={handleChange} required />

                        <button type="submit">{(httpType === 'post') ? 'Add' : 'Save'}</button>
                    </fieldset>
                </form>
            </div>
        </>
    );
};
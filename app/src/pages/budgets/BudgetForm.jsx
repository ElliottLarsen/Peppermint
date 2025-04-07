import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import axios from "axios";
import { categories } from "../../app_utilities/TransactionCategories";
import { handleError } from "../../app_utilities/HandleError";

export default function BudgetForm({ httpType, budget_id, refreshBudgets, setIsActive }) {
    const getToken = () => localStorage.getItem('token');
    const navigate = useNavigate();
    const [budgetData, setBudgetData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        budget_category: '',
        budget_amount: ''
    });

    useEffect(() => {
        if (httpType === 'put') {
            fetchBudgetData(budget_id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchBudgetData = async (budget_id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/peppermint/budget/${budget_id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const data = response.data
            setBudgetData(data);
            setSelectedCategory(data.budget_category)
            setFormData({
                budget_category: data.budget_category,
                budget_amount: data.budget_amount
            });
            setLoading(false);
        } catch (error) {
            handleError(error, navigate);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault()
        try {

            await axios.post("http://127.0.0.1:8000/peppermint/budget/", formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            setFormData({
                budget_category: '',
                budget_amount: ''
            });
            alert("Budget added successfully!")
            setIsActive('budgetsHome');
            refreshBudgets();
        } catch (error) {
            console.error('Error adding budget', error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`http://127.0.0.1:8000/peppermint/budget/${budget_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            alert('Budget updated successfully!');
            fetchBudgetData(budget_id);
            refreshBudgets();
            setIsActive('budgetsHome');
        } catch (error) {
            handleError(error, navigate);
        }
    };

    function handleClick() {
        setIsActive('budgetsHome');
    }

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    if (!budgetData && (httpType === 'put')) {
        return <div><p>No budget info available.</p></div>
    }

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
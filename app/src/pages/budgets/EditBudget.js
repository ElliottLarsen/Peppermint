import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { categories } from '../../app_utilities/TransactionCategories';
import { useEffect, useState } from 'react';
import { handleError } from '../../app_utilities/HandleError';

export default function EditBudget() {
    const navigate = useNavigate();
    const getToken = () => localStorage.getItem('token');
    const { budgetId } = useParams();
    const [budgetData, setBudgetData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        budget_category: '',
        budget_amount: ''
    });

    useEffect(() => {
        fetchBudgetData();
    }, [budgetId]);

    const fetchBudgetData = async () => {
        try{
            const response = await axios.get(`http://127.0.0.1:8000/peppermint/budget/${budgetId}`, {
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

    const handleCategorySelect = (e) => {
        const selectedValue = e.target.value;
        setSelectedCategory(selectedValue);
        setFormData({
            ...formData,
            budget_category: selectedValue,
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`http://127.0.0.1:8000/peppermint/budget/${budgetId}`, formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}` 
            } 
            });
            alert('Budget updated successfully!');
            navigate('/budgets');
        } catch (error) {
            handleError(error, navigate);
        }
    };

    if (loading) {
        return <div><p>Loading...</p></div>;
    }
    
    if (!budgetData) {
        return <div><p>No budget info available.</p></div>
    }

    return (
        <>
         <div>
            <h3>Edit Budget</h3>
        </div>
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor='budget_category' className='required'>Category: </label>
                    <select name='budget_category' id='budget_category' value={selectedCategory} onChange={handleCategorySelect}>
                        <option value="" selected></option>
                        { categories.map((category) => (
                            <option key={ category.value } value={ category.value }>
                                { category.key }
                            </option>
                    ))}
                    </select>

                    <label htmlFor='budget_amount' className='required'>Amount:</label>
                    <input type="number" min="0" step="0.01" name="budget_amount" value={formData.budget_amount} id='budget_amount'
                    onChange={handleChange} required/>
                    
                    <button type="submit">Save</button>
                </fieldset>
            </form>
        </div>
        
        </>
    )

};
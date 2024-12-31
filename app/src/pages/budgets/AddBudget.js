import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { categories } from '../../components/TransactionCategories';

export default function AddBudget() {
    const [addNewBudget, setNewBudget] = useState({
        budget_category: '',
        budget_amount: ''
})

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token');
            await axios.post("http://127.0.0.1:8000/peppermint/budget/", addNewBudget, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setNewBudget({
            budget_category: '',
            budget_amount: ''
        });
        alert("Budget added successfully!")
        navigate("/budgets")
        } catch (error) {
            console.error('Error adding budget', error);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setNewBudget({
            ...addNewBudget,
            [name]: value
        });
    };

    return (
        <>
        <div>
            <h3>Add New Budget</h3>
        </div>
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor='budget_category' className='required'>Category: </label>
                    <select name='budget_category' id='budget_category' onChange={handleChange}>
                        <option value="" selected></option>
                        { categories.map((category) => (
                            <option key={ category.value } value={ category.value }>
                                { category.key }
                            </option>
                    ))}
                    </select>

                    <label htmlFor='budget_amount' className='required'>Amount:</label>
                    <input type="number" min="0" step="0.01" name="budget_amount" placeholder='0.00' id='budget_amount'
                    onChange={handleChange} required/>
                    
                    <button type="submit">Add</button>
                </fieldset>
            </form>
        </div>
        </>
    );
};
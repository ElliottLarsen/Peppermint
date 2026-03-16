import { categories } from "../../app_utilities/TransactionCategories";

export const Form = ({ 
    editMode, 
    handleChange, 
    handleSubmit, 
    handleAccountSelect, 
    selectedAccount, 
    formData,
    accountOptions
}) => {
    return (
        <>
        <div>
            <h3>{ editMode ? "Update" : "Add New"} Transaction</h3>
        </div>
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    { !editMode && (
                        <>
                        <label htmlFor='account_id'>Account</label>
                        <select id="account_id" value={selectedAccount} onChange={handleAccountSelect} required>
                    { accountOptions && accountOptions.map((account) => (
                        <option key={ account.value } value={ account.value }>
                            { account.key }
                        </option>
                    ))}
                    </select>
                        </>
                    )}

                    <label htmlFor='transaction_date' className='required'>Date </label>
                    <input type='datetime-local' name='transaction_date' value={formData.transaction_date || ""} id='transaction_date'
                    onChange={handleChange} required />

                    <label htmlFor='transaction_description'>Description: </label>
                    <input type='text' name='transaction_description' value={formData.transaction_description || ""} placeholder='description' id='transaction_description'
                    onChange={handleChange} required />

                    <label htmlFor='transaction_category'>Category:</label>
                    <select name='transaction_category' id='transaction_category' value={formData.transaction_category || ""} onChange={handleChange}>
                        <option value="" selected></option>
                        { categories.map((category) => (
                            <option key={ category.value } value={ category.value }>
                                { category.key }
                            </option>
                    ))}
                    </select>

                    <label htmlFor='transaction_amount' className='required'>Amount:</label>
                    <input type="number" min="0" step="0.01" name="transaction_amount" value={formData.transaction_amount || ""} placeholder='0.00' id='transaction_amount'
                    onChange={handleChange} required/>
                    
                    <button type="submit">{editMode ? "Save" : "Add"} </button>
                </fieldset>
            </form>
        </div>
        </>
    );
};
export default Form;
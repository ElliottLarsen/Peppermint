import { IoArrowBackCircleOutline } from "react-icons/io5";
import { accountCategories } from '../../app_utilities/AccountCategories';
import { useAccountsForm } from "../../hooks/useAccountsForm";

export default function AccountForm({ httpType, account_id, refreshAccounts, setIsActive }) {
    const {
        accountData,
        loading,
        handleAddSubmit,
        handleEditSubmit,
        handleChange,
        formData,
        selectedType,
    } = useAccountsForm(account_id, httpType, refreshAccounts, setIsActive);

    function handleClick() {
        setIsActive('accountHome');
    }

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    if (!accountData && httpType === 'put') {
        return <div><p>No account info available.</p></div>;
    }

    return (
        <>
            <div className='account-table'>
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
                            <h2>{(httpType === 'post') ? 'Add New' : 'Update'} Account</h2>
                        </legend>
                        <label htmlFor='institution' className='required'>Institution: </label>
                        <input type='text' name='institution' value={formData.institution} id='institution'
                            onChange={handleChange} required />


                        <label htmlFor='account_type' className='required'>Account type: </label>
                        <select name='account_type' id='account_type' defaultValue={selectedType} onChange={handleChange}>
                            <option value=""></option>
                            {accountCategories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.key}
                                </option>
                            ))}
                        </select>

                        <label htmlFor='current_balance' className='required'>Current balance</label>
                        <input type="number" step="0.01" name="current_balance" value={formData.current_balance} id='current_balance'
                            onChange={handleChange} required />

                        <button type="submit">{(httpType === 'post') ? 'Add' : 'Save'}</button>
                    </fieldset>
                </form>
            </div>
        </>
    );
}
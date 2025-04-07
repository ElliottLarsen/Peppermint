import FormatCurrency from "../../app_utilities/FormatCurrency";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

export default function BudgetsDisplay({ currentBalances, budgets, handleFormClick, handleDeleteBudget }) {
    return (
        <>
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
                            <td><FormatCurrency amount={currentBalances[budget.budget_category]} /></td>
                            <td><FormatCurrency amount={budget.budget_amount} /></td>
                            <td>
                                <i className="edit-button" title="Edit Budget">
                                    <MdOutlineEdit
                                        onClick={() => handleFormClick('editBudget', budget.id)} />
                                </i>
                                <i className="delete-button" title="Delete Budget">
                                    <MdDeleteOutline
                                        onClick={() => handleDeleteBudget(budget.id)} />
                                </i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
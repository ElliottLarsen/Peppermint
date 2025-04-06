import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import FormatCurrency from "../../app_utilities/FormatCurrency";

export default function AccountsDisplay({ accounts, handleFormClick, handleDeleteAccount }) {
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Institution</th>
                        <th>Account Type</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map(account => (
                        <tr key={account.id}>
                            <td>{account.institution}</td>
                            <td>{account.account_type}</td>
                            <td><FormatCurrency amount={account.current_balance} /></td>
                            <td>
                                <i className="edit-button" title="Edit Account">
                                    <MdOutlineEdit
                                        onClick={() => handleFormClick('editAccount', account.id)}
                                    />
                                </i>
                                <i className="delete-button" title="Delete Account">
                                    <MdDeleteOutline
                                        onClick={() => handleDeleteAccount(account.id)} />
                                </i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
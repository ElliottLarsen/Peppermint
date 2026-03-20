import { useParams, useNavigate } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import FormatCurrency from '../app_utilities/FormatCurrency';
import FormatDate from '../app_utilities/FormatDate';

const ViewAccountDetail = () => {
    const { accountId } = useParams();
    const navigate = useNavigate();

    const { account, accountTransactions, loading} = useAccounts(accountId, {fetchDetails: true});
    const { deleteTransaction } = useTransactions();

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    if (!accountTransactions) {
        return <div><p>No transaction info available.</p></div>;
    }
    
    const accountName = account.institution;

    return (
        <>
        <div class="page-title">
            <h2>{accountName} Transactions</h2>
        </div>
        <div class="account-table">
        { accountTransactions.length === 0 ? (
            <p>No transactions found </p>
        ) : (
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {accountTransactions.map(transaction => (
                <tr key={transaction.id}>
                    <td><FormatDate date={transaction.transaction_date}/></td>
                    <td>{transaction.transaction_description}</td>
                    <td>{transaction.transaction_category}</td>
                    <td><FormatCurrency amount={transaction.transaction_amount}/></td>
                    <td><i class="edit-button" title="Edit Account"><MdOutlineEdit 
                        onClick={() => navigate(`/transactions/edit_transaction/${transaction.account_id}/${transaction.id}`)} /></i>
                    <i class="delete-button" title="Delete Account"><MdDeleteOutline 
                        onClick={() => deleteTransaction(transaction.account_id, transaction.id)} /></i></td>
                </tr>
            ))}
            </tbody>
        </table>
        )}
        </div>
        </>
    );
}

export default ViewAccountDetail;
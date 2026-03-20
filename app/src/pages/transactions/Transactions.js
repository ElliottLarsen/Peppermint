import { useNavigate } from 'react-router-dom'
import { MdOutlineEdit, MdAddCircleOutline, MdDeleteOutline } from "react-icons/md";
import FormatCurrency from '../../app_utilities/FormatCurrency';
import FormatDate from '../../app_utilities/FormatDate';
import { useTransactions } from '../../hooks/useTransactions';

const GetAllTransactions = () => {
    const navigate = useNavigate();
    const { transactions, deleteTransaction } = useTransactions();

    return (
        <>
            <div class="page-title">
                <h2>All Transactions</h2>
            </div>
            <div class='account-table'>
                <div>
                    <i class="add-button" title="Add New Transaction"><MdAddCircleOutline onClick={() => navigate('/transactions/add_transaction')} /></i>
                </div>
                <div>
                    {transactions?.length === 0 ? (
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
                                {transactions?.map((transaction, index) => (
                                    <tr key={index}>
                                        <td><FormatDate date={transaction.transaction_date} /></td>
                                        <td>{transaction.transaction_description}</td>
                                        <td>{transaction.transaction_category}</td>
                                        <td><FormatCurrency amount={transaction.transaction_amount} /></td>
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
            </div>
        </>
    );
};

export default GetAllTransactions;
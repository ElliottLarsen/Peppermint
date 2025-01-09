import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { MdOutlineEdit, MdAddCircleOutline, MdDeleteOutline } from "react-icons/md";
import FormatCurrency from '../../app_utilities/FormatCurrency';
import FormatDate from '../../app_utilities/FormatDate';
import { handleError } from '../../app_utilities/HandleError';

const GetAllTransactions = () => {
    const navigate = useNavigate();
    const getToken = () => localStorage.getItem('token');

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchAllTransactions();
    }, []);

    const fetchAllTransactions = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/peppermint/account/all_transactions', {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const data = response.data
            if (data.length === 0) {
                alert('No Transactions available at this time');
                setTransactions([]);
            } else {
                setTransactions(data);
            }
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const handleDeleteTransaction = async (account_id, id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/peppermint/${account_id}/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            await fetchAllTransactions();
            alert('Transaction deleted!')
        } catch (error) {
            handleError(error, navigate);
        }
    };

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
                    {transactions.length === 0 ? (
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
                                {transactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td><FormatDate date={transaction.transaction_date} /></td>
                                        <td>{transaction.transaction_description}</td>
                                        <td>{transaction.transaction_category}</td>
                                        <td><FormatCurrency amount={transaction.transaction_amount} /></td>
                                        <td><i class="edit-button" title="Edit Account"><MdOutlineEdit
                                            onClick={() => navigate(`/transactions/edit_transaction/${transaction.account_id}/${transaction.id}`)} /></i>
                                            <i class="delete-button" title="Delete Account"><MdDeleteOutline
                                                onClick={() => handleDeleteTransaction(transaction.account_id, transaction.id)} /></i></td>
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
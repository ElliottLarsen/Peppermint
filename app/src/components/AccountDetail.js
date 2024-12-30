import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import FormatCurrency from './FormatCurrency';
import FormatDate from './FormatDate';

const ViewAccountDetail = () => {
    const { accountId } = useParams();
    const [accountTransactions, setAccountTransactions] = useState(null);
    const [accountName, setAccountName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAccountTransactions();
    }, [accountId]);

    useEffect(() => {
        const fetchAccountName = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8000/peppermint/account/${accountId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAccountName(response.data.institution);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchAccountName();
    }, [accountId]);

    const fetchAccountTransactions =  async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://127.0.0.1:8000/peppermint/account/${accountId}/transactions`, {
                headers: {
                        Authorization: `Bearer ${token}`
                }
            });
            setAccountTransactions(response.data);
            return response.data || [];
            
        } catch (error) {
            setError(error.message);
            setLoading(false);
            if (error.response.status === 401) {
                navigate('/login');
            return [];
            }
        }
    };

    const handleDeleteTransaction = async(account_id, id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/peppermint/${account_id}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchAccountTransactions();
            alert('Transaction deleted!')
        } catch (error) {
            console.error('Error retrieving transactions', error);
            if (error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    if (error) {
        return <div><p>Error: {error}</p></div>;
    }

    if (!accountTransactions) {
        return <div><p>No transaction info available.</p></div>;
    }
    
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
                        onClick={() => handleDeleteTransaction(transaction.account_id, transaction.id)} /></i></td>
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
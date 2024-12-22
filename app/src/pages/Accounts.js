import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { MdOutlineEdit } from "react-icons/md";
import ViewAccounts from '../components/ViewAccounts';

const Accounts = () => {
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [formData, setFormData] = useState({
        institution: '',
        account_type: '',
        current_balance: ''
    });

    useEffect(() => {
        const fetchAccounts = async
    })



}
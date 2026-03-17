import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleError } from "../app_utilities/HandleError";
import api from "../api/client";

export const useAccountsForm = (account_id, httpType, refreshAccounts, setIsActive) => {
    const navigate = useNavigate();
    const [ formData, setFormData ] = useState({
        institution: '',
        account_type: '',
        current_balance: ''
    });
    const [ accountData, setAccountData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ selectedType, setSelectedType ] = useState("");

    useEffect(() => {
        if (httpType === 'put') {
            fetchAccountData(account_id)
        } else {
            setLoading(false);
        }
    }, [account_id])

    const fetchAccountData = async (account_id) => {
        try {
            const response = await api.get(`/account/${account_id}`);
            setAccountData(response.data);
            setSelectedType(response.data.account_type);
            setFormData({
                institution: response.data.institution,
                account_type: response.data.account_type,
                current_balance: response.data.current_balance
            });
            setLoading(false);
        } catch (error) {
            handleError(error, navigate);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post("/account/", formData);
            setFormData({
                institution: '',
                account_type: '',
                current_balance: ''
            });
            alert("Account added successfully!")
            setIsActive('accountHome');
            refreshAccounts();
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.put(`/account/${account_id}`, formData);
            alert('Account updated successfully');
            setIsActive('accountHome');
            fetchAccountData(account_id);
            refreshAccounts();
        } catch (error) {
            handleError(error, navigate);
        }
    };

    return {
        fetchAccountData,
        handleAddSubmit,
        handleEditSubmit,
        handleChange,
        accountData,
        formData,
        loading,
        selectedType,
    }

};
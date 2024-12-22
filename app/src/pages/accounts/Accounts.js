import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { MdOutlineEdit, MdAddCircleOutline } from "react-icons/md";
import ViewAccounts from '../../components/ViewAccounts';

export default function Accounts() {
    const navigate = useNavigate();

    return (
        <>
        <div class="page-title">
            <h2>Accounts</h2>
        </div>
        <i class="add-button" alt="Add New Account"><MdAddCircleOutline onClick={() => navigate('/accounts/add_account')} /></i>
        <div>
        <ViewAccounts />
        </div>
        </>
    )
};

import { useState } from 'react';

import { MdAddCircleOutline } from "react-icons/md";

import { useAccounts } from '../../hooks/useAccounts';

import AccountsDisplay from './AccountsDisplay';
import AccountForm from './AccountForm';

export default function GetAccounts() {
    const [accountId, setAccountId] = useState();
    const [isActive, setIsActive] = useState('accountHome')

    const { accounts, fetchAccounts, deleteAccount, loading } = useAccounts(null, {fetchAll:true});
 
    if (!accounts) {
        return <div><p>No account info available.</p></div>;
    }

    function handleFormClick(value, account_id) {
        setIsActive(value);
        if (value === 'editAccount') {
            setAccountId(account_id);
        }
    };

    return (
        <>
            <div className="page-title">
                <h2>Accounts</h2>
            </div>
            {(isActive === 'accountHome') ? (
                <div className="account-table">
                    <div>
                        <i className="add-button" title="Add New Account">
                            <MdAddCircleOutline onClick={() => handleFormClick('addAccount')} />
                        </i>
                    </div>
                    <div>
                        { (accounts.length > 0) ? (
                        <AccountsDisplay
                            accounts={accounts}
                            handleFormClick={handleFormClick}
                            handleDeleteAccount={deleteAccount}
                        /> ) : (<p>Add an account!</p>)
                        }
                    </div>
                </div>
            ) : ((isActive === 'editAccount') ? (
                <AccountForm
                    httpType={'put'}
                    account_id={accountId}
                    refreshAccounts={fetchAccounts}
                    setIsActive={setIsActive}
                />
            ) : (
                <AccountForm
                    httpType={'post'}
                    refreshAccounts={fetchAccounts}
                    setIsActive={setIsActive}
                />
            ))}
        </>
    )
};

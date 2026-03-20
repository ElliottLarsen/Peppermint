import { useNavigate } from 'react-router-dom'
import { useAccounts } from '../hooks/useAccounts';

import AccountCard from './AccountCard';

import FormatCurrency from '../app_utilities/FormatCurrency';

const ViewAccounts = () => {
    const { accounts } = useAccounts(null, {fetchAll:true});
    const navigate = useNavigate();

    if (!accounts || accounts.length === 0) {
        return <div><p>No account info available.</p></div>;
    }

    return (
        <>
        <div>
            <div class="account-col">
                {/* {accounts?.map(account => (
                    <div class="acct-box" key={account.id}>
                        <div class="acct-detail" title="Account Details" onClick={() => navigate(`/accounts/${account.id}`)}>{account.institution}</div>
                        <div class="curr-balance">
                        <FormatCurrency amount={account.current_balance}/>
                        </div> 
                    </div>
                ))} */}
                {accounts?.map(account => (
                    <AccountCard 
                        accountId={account.id}
                        accountName={account.institution}
                        accountType={account.account_type}
                        accountBalance={<FormatCurrency amount={account.current_balance}/>}
                    />
                )

                )}
            </div>
        </div>
        </>
    )
};

export default ViewAccounts;
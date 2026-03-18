import { AiOutlineBank } from 'react-icons/ai';
import { LuPiggyBank, LuCircleEllipsis } from "react-icons/lu";
import { CiCreditCard2, CiMoneyBill } from "react-icons/ci";

import { useNavigate } from 'react-router-dom';

const accountIcons = { 
    "Checking": <AiOutlineBank />,
    "Savings": <LuPiggyBank/>,
    "Credit Card": <CiCreditCard2/>,
    "Loan": <CiMoneyBill/>,
    "Other": <LuCircleEllipsis />
}

export const AccountCard = ({ accountId, accountName, accountType, accountBalance}) => {
    const navigate = useNavigate();
    return (
        <>
        <div className='acct-card' key={accountId}>
            <div className='acct-icon'>{accountIcons[accountType]}</div>
            <div>
                <div className='acct-detail'  onClick={() => navigate(`/accounts/${accountId}`)}>{accountName}</div>
                <div>{accountType}</div>
            </div>
            
            
            <div>{accountBalance}</div>
        </div> 
        </>
    );

};

export default AccountCard;
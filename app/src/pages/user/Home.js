import ViewAccounts from '../../components/ViewAccounts';
import ExpensesBarGraph from '../../components/ExpensesBarGraph';
import ExpenseCategoryDoughnut from '../../components/ExpensesCategory';

import { useUsers } from '../../hooks/useUsers';

const LandingPage = () => {
    const { userData, loading } = useUsers();

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    const username = userData.username;

    if (!username) {
        return <div><p>No user info available.</p></div>;
    }

    return (
        <>
        <div class="page-title">
            <h2>Welcome back, {username}!</h2>
        </div>
        <div class='main-display'>
        <div class="user-landing">
            <div>
                <ViewAccounts />
            </div>
                
            {/* <div class='account-card'>
                <ViewAccounts />
            </div> */}
            <div class='expenses-card'>
              <ExpensesBarGraph />
            </div>
        </div>
        {/* <div><ViewAccounts/></div> */}
        <div class ='expense-category-card'>
            <ExpenseCategoryDoughnut />
        </div>
        </div>
        </>
    )
};

export default LandingPage;
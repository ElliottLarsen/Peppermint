import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, ArcElement, Colors, Title, Tooltip, } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { useAccounts } from '../hooks/useAccounts';

ChartJS.register(CategoryScale, ArcElement, Colors, Title, Tooltip);

const ExpenseCategoryDoughnut = () => {
        const [expensesDoughnut, setExpensesDoughnut] = useState(null);
        const { expenseCategoryData } = useAccounts(null, {fetchAnalytics:true});
  
        useEffect(() => {
            if (Object.keys(expenseCategoryData).length > 0) {
                createDoughnutGraph();
            }
        }, [expenseCategoryData]);

        const createDoughnutGraph = () => {

            const categoryLabels = Object.keys(expenseCategoryData);
            const categoryTotals = Object.values(expenseCategoryData);

            const doughnutData = {
                labels: categoryLabels,
                datasets: [{
                    data: categoryTotals,
                    hoverOffset: 4,
                }]
            };
            const doughnutOptions = {
                plugins: {
                    title: {
                        display: true,
                        text:"Current Month Expenses by Category"},
                    legend: {
                        display: true,
                        position: 'bottom',
                    },
                    colors: {}
                }
            };
            setExpensesDoughnut({ data: doughnutData, options: doughnutOptions});
        };

    return (
        <div>
            { expensesDoughnut ? (
                <Doughnut 
                    data={ expensesDoughnut.data} 
                    options={ expensesDoughnut.options }
                    height="300"
                    width='300'
                    innerRadius={60}
                    outerRadius={80}
                />
            ):(<p>Loading...</p>)
            }
        </div>
    );
};

export default ExpenseCategoryDoughnut;
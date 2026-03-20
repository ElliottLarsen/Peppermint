import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarController, BarElement, Title, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { useAccounts } from '../hooks/useAccounts';

ChartJS.register(LinearScale, CategoryScale, BarController, BarElement, Title, Legend);

const ExpensesBarGraph = () => {
    const [expensesChart, setExpensesChart] = useState(null);
    const { expensesData } = useAccounts(null, {fetchAnalytics:true});

    useEffect(() => {
        if (Object.keys(expensesData).length > 0) {
            createBarGraph();
        }
    }, [expensesData]);

    const createBarGraph = () => {

        const expenseLabels = Object.keys(expensesData);
        const expenseTotal = Object.values(expensesData);
            
        const chartData = {
                labels: expenseLabels,
                datasets: [
                    {
                    label: 'Expense Totals',
                    data: expenseTotal,
                    backgroundColor: 'rgba(0,255,0,0.5)',
                    borderColor: "black",
                    borderWidth: "2"
                    },
                ],
            };
            const chartOptions = {
                plugins: {
                    title: {
                        display: true,
                        text: 'Last 6 Months Expense Totals'
                    },
                },
                responsive: true,
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true
                    },
                },
            };
            setExpensesChart({ data: chartData, options: chartOptions });
        };

    return (
        <div>
            { expensesChart ? (
                <Bar data={ expensesChart?.data } options={ expensesChart?.options } width='400' height='200' />
            ) : (<p>Loading...</p>)
            }
        </div>
    );
};


export default ExpensesBarGraph;
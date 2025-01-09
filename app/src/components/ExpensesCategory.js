import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../app_utilities/HandleError';
import { Chart as ChartJS, CategoryScale, ArcElement, Colors, Title, Tooltip, plugins } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, ArcElement, Colors, Title, Tooltip);

const ExpenseCategoryDoughnut = () => {
        const getToken = () => localStorage.getItem('token');
        const navigate = useNavigate();
        const [expenseCategoryData, setExpensesCategoryData]= useState({});
        const [expensesDoughnut, setExpensesDoughnut] = useState(null);

        useEffect(() => {
            fetchExpenseCategoryData();
        }, []);
        
        useEffect(() => {
            if (Object.keys(expenseCategoryData).length > 0) {
                createDoughnutGraph();
            }
        }, [expenseCategoryData]);

        const fetchExpenseCategoryData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/peppermint/account/expenses/by_category`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                });
                setExpensesCategoryData(response.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };

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
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../app_utilities/HandleError';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Title, Legend } from 'chart.js';

Chart.register(LinearScale, CategoryScale, BarController, BarElement, Title, Legend);

const ExpensesBarGraph = ( {expensesData} ) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (expensesData && chartRef.current); {
            if (chartInstance) {
                chartInstance.destroy();
            }

            console.log(expensesData)
            const labels = Object.keys(expensesData).map(date => {
                const [year, month] = date.split('-');
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
            });
            const expenses = Object.values(expensesData);
    
            const ctx = document.getElementById('expensesChart').getContext('2d');
    
            const expensesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Last 6 Months Expenses',
                        data: expenses,
                        backgroundColor: 'rgba(0,255,0,0.5)',
                        borderColor: "rgba(0,255,0,1)",
                        borderWidth: "1"
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        return () => {
            if (expensesChart) {
                expensesChart.destroy();
            }
        };
        }, [expensesData]);

        return <canvas ref={ chartRef } id="expensesChart" width='400' height='200' />;
};


export default ExpensesBarGraph;
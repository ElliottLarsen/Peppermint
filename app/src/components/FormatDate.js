// Create Date Formatter
import React from 'react';

const FormatDate = ({ date }) => {
    const dateFormatted = (inputDate) => {
        const options = { day: '2-digit', month: 'short' };
        return new Date(inputDate).toLocaleDateString('en-US', options);
    };
    return <span>{ dateFormatted(date) }</span>;
};

export default FormatDate;
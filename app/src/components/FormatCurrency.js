import React from 'react';

const FormatCurrency = ({ amount }) => {
    const displayCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);
    };

    return displayCurrency(amount);
}

export default FormatCurrency;
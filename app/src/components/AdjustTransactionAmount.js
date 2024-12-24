export const adjustTransactionAmount = (category, amount) => {
    const creditCategories = new Set([
        'credit', 
        'transfer',
        'income'
    ]);

    return creditCategories.has(category)
    ? Math.abs(amount)
    : -Math.abs(amount);
};

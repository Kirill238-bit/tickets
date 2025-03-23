function convertCurrency(amount, targetCurrency) {
    if (typeof amount !== 'number') {
        return amount;
    }

    let convertedAmount

    switch (targetCurrency) {
        case '2':
            convertedAmount = amount / 2;
            break;
        case '3':
            convertedAmount = amount / 3;
            break;
        default:
            convertedAmount = amount;
            break;
    }

    return Math.round(convertedAmount);
}

module.exports = convertCurrency;
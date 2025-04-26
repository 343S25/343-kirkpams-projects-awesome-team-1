function retotalBalance(account) {
    account.transactions.forEach(transaction => {
        account.balance = 0;

        if (transaction.isDeposit) {
            account.balance += transaction.amount;
        } else {
            account.balance -= transaction.amount;
        }
    });

    account.stocks.forEach(stock => {
        account.balance += (stock.quantatity * stock.lastCalculatedPrice);
    });
    return;
}

function deleteTransaction(account, transaction) {
    account.transcations = account.transcations.filter(t => t.id !== transaction.id);
    retotalAccount(account);
}

function deleteStock(account, stockTicker) {
    account.stocks = account.stocks.filter(stock => stock.ticker !== stockTicker);
    retotalAccount(account);
}
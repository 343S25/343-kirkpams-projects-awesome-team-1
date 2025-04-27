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

/** Creates the tr node that contains information given the transaction object
 * @param {Object} transaction - The transaction object containing details of the transaction
 */
function createTransactionHTML(transaction) {
    let tbody = document.querySelector('tbody');
    let transactionPrototype = document.getElementById('transactionPrototype');
    let transactionRow = transactionPrototype.cloneNode(true);
    transactionRow.removeAttribute('id');
    transactionRow.classList.remove('d-none');
    let childTds = transactionRow.querySelectorAll('td');

    // Fill in transaction details
    childTds[0].textContent = transaction.isDeposit ? 'Deposit' : 'Withdrawal';
    childTds[1].textContent = transaction.date;
    childTds[2].textContent = transaction.description;
    childTds[3].textContent = `$${transaction.amount.toLocaleString()}`; // Format amount with commas

    return transactionRow;
}



function deleteTransaction(account, transaction) {
    account.transcations = account.transcations.filter(t => t.id !== transaction.id);
    retotalAccount(account);
}

function deleteStock(account, stockTicker) {
    account.stocks = account.stocks.filter(stock => stock.ticker !== stockTicker);
    retotalAccount(account);
}
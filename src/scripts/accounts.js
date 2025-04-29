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
        account.balance += (stock.quantity * stock.quote);
    });
    return;
}

/** Creates the tr node that contains information given the transaction object
 * @param {Object} transaction - The transaction object containing details of the transaction
 */
function createTransactionHTML(transaction) {
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

/**
 * Creates the HTML for a stock object.
 * @param {Object} stock 
 */
function createStockHTML(stock) {
    let stockPrototype = document.getElementById('stockPrototype');
    let stockRow = stockPrototype.cloneNode(true);
    stockRow.removeAttribute('id');
    stockRow.classList.remove('d-none');
    let childTds = stockRow.querySelectorAll('td');

    // Fill in stock details
    childTds[0].textContent = stock.ticker;
    childTds[1].textContent = stock.quantity;
    childTds[2].textContent = `$${stock.quote.toLocaleString()}`; // Format amount with commas
    childTds[3].textContent = `$${(stock.quantity * stock.quote).toLocaleString()}`; // Format amount with commas

    return stockRow;
}

/**
 * Add transaction to account object, display on page, and update balance.
 * @param {string} accountNameId - Id of the account to add transaction to
 */
function addTransaction(accountName) {
    let transactionType = document.getElementById('transactionType').value;
    transactionType = transactionType === 'Deposit';
    let amount = parseFloat(document.getElementById('transactionAmount').value);
    let description = document.getElementById('transactionDescription').value;
    let date = document.getElementById('transactionDate').value;
    let accounts = localStorage.getItem('accounts');

    // Assuming transaction button should not be functional if no account is there.
    accounts = JSON.parse(accounts);
    let accountNameId = accountName.split(' ').join('-').toLowerCase();
    let account = accounts.find(account => account.id === accountNameId);
    console.log(account);
    if (!account) {
        document.getElementById('addTransactionWarning').textContent = 'No account found.';
        return;
    }

    if (amount <= 0 || !description || !date) {
        document.getElementById('addTransactionWarning').textContent = 'Please fill in all fields correctly.';
        return;
    }
    let transaction = {
        isDeposit: transactionType,
        amount: amount,
        description: description,
        date: date
    }
    account.transactions.push(transaction);
    account.balance += transactionType ? amount : -amount;
    account.lastUpdated = new Date().toLocaleDateString();
    localStorage.setItem('accounts', JSON.stringify(accounts));
    document.getElementById('addTransactionWarning').textContent = '';

    // Create table row and add to tbody
    let tbody = document.querySelector('tbody');
    let transactionRow = createTransactionHTML(transaction);

    tbody.appendChild(transactionRow);

    let close = document.getElementById('transactionClose');
    close.click();

}

/**
 * Add stock to account
 * @param {string} accountName - Id of the account to add stock to
 */
function addStock(accountName) {
    let accounts = localStorage.getItem('accounts');
    accounts = JSON.parse(accounts);
    let accountNameId = accountName.split(' ').join('-').toLowerCase();
    let account = accounts.find(account => account.id === accountNameId);
    let warning = document.getElementById('addStockWarning');
    if (!account) {
        return;
    }

    let ticker = document.getElementById('stockSymbol').value.toUpperCase().trim();
    let shares = parseFloat(document.getElementById('stockQuantity').value);
    if (shares <= 0) {
        warning.textContent = 'Please enter a valid number of shares.';
        return;
    }

    getStockQuote(ticker)
        .then(quote => {
            if (Object.keys(quote).length === 0) {
                warning.textContent = 'Invalid stock ticker.';
                return;
            }

            let stock = {
                ticker: ticker,
                quantity: shares,
                quote: parseFloat(quote['05. price']),
            }

            let existingStock = account.stocks.find(stock => stock.ticker === ticker);
            if (existingStock) {
                existingStock.quantity += shares;
                existingStock.quote = stock.quote; // Update the quote to the latest
                location.reload();
            } else {
                account.stocks.push(stock);
                let tbody = document.querySelectorAll('tbody')[1]; // Stocks instead of transactions
                let stockRow = createStockHTML(stock);
                tbody.appendChild(stockRow);
            }

            account.lastUpdated = new Date().toLocaleDateString();
            localStorage.setItem('accounts', JSON.stringify(accounts));
            warning.textContent = '';
            document.getElementById('stockSymbol').value = '';
            document.getElementById('stockQuantity').value = 0;
            account.lastUpdated = new Date().toLocaleDateString();
            let close = document.getElementById('closeStockButton');
            close.click();

        })
    //.catch(error => {
    //    console.error('Error fetching stock data:', error);
    //});
}



function deleteTransaction(account, transaction) {
    account.transcations = account.transcations.filter(t => t.id !== transaction.id);
    retotalAccount(account);
}

function deleteStock(account, stockTicker) {
    account.stocks = account.stocks.filter(stock => stock.ticker !== stockTicker);
    retotalAccount(account);
}
/**
 * This file contains functions to handle account management, including creating, editing, and deleting accounts and transactions.
 */

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

    // Only happens on account page
    if (childTds.length > 4) {
        childTds[4].querySelector('button').addEventListener('click', () => {
            fillTransactionEditModal(transaction);
        });
    }

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
    childTds[4].querySelector('button').addEventListener('click', () => {
        fillStockEditModal(stock);
    });

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
    if (!account) {
        document.getElementById('addTransactionWarning').textContent = 'No account found.';
        return;
    }

    if (amount <= 0 || !description || !date) {
        document.getElementById('addTransactionWarning').textContent = 'Please fill in all fields correctly.';
        return;
    }

    let transaction = {
        dateCreated: new Date(),
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


    // Clear input fields
    document.getElementById('transactionAmount').value = 0;
    document.getElementById('transactionDescription').value = '';
    document.getElementById('transactionDate').value = '';
    document.getElementById('transactionType').value = 'Deposit';

    location.reload();

}

/**
 * Add stock to account with accountName as its name.
 * @param {string} accountName - Name of the account to add stock to
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
    if (shares <= 0 || isNaN(shares)) {
        warning.textContent = 'Please enter a valid number of shares.';
        return;
    }

    getStockQuote(ticker)
        .then(quote => {
            console.log(quote);

            if (quote === undefined) {
                warning.textContent = 'API is over request limit.';
            }


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
            retotalBalance(account);

        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
        });
}


/**
 * Fill the transaction edit modal with the transaction information.
 * @param {Object} transaction 
 */
function fillTransactionEditModal(transaction) {
    let transactionType = document.getElementById('editTransactionType');
    let transactionAmount = document.getElementById('editTransactionAmount');
    let transactionDescription = document.getElementById('editTransactionDescription');
    let transactionDate = document.getElementById('editTransactionDate');
    let dateCreated = document.getElementById('dateCreatedID');

    transactionType.value = transaction.isDeposit ? 'Deposit' : 'Withdrawal';
    transactionAmount.value = transaction.amount;
    transactionDescription.value = transaction.description;
    transactionDate.value = transaction.date;

    // Unique hidden id
    dateCreated.textContent = JSON.stringify(transaction.dateCreated);
}

/**
 * Fill the account edit modal with the account information.
 * @param {Object} account 
 */
function fillAccountEditModal(account) {
    let accountName = document.getElementById('editAccountName');
    let description = document.getElementById('editAccountDescription');

    accountName.value = account.name;
    description.value = account.description || '';
}


/**
 * FIll the stock edit modal with the stock information.
 * @param {Object} stock 
 */
function fillStockEditModal(stock) {
    let stockSymbol = document.getElementById('editStockSymbol');
    let stockQuantity = document.getElementById('editStockQuantity');

    stockSymbol.textContent = stock.ticker;
    stockQuantity.value = stock.quantity;
}

/**
 * Saves the modified transaction to the account and updates localStorage.
 * @param {Object} account 
 * @param {Object} accounts 
 */
function saveTransaction(account, accounts) {


    let dateCreated = JSON.parse(document.getElementById('dateCreatedID').textContent);
    let transaction = account.transactions.find(transaction => transaction.dateCreated === dateCreated);
    account.transactions = account.transactions.filter(transaction => transaction.dateCreated !== dateCreated);

    let newType = document.getElementById('editTransactionType').value;
    let newAmount = parseFloat(document.getElementById('editTransactionAmount').value);
    let newDescription = document.getElementById('editTransactionDescription').value;
    let newDate = document.getElementById('editTransactionDate').value;

    console.log(newType);
    transaction = {
        date: newDate,
        isDeposit: newType === 'Deposit',
        amount: newAmount,
        description: newDescription,
        dateCreated: transaction.dateCreated
    }

    account.transactions.push(transaction);
    account.lastUpdated = new Date().toLocaleDateString();

    retotalBalance(account);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    location.reload();
}

/**
 * Saves the modified stock to the account and updates localStorage.
 * @param {Object} account 
 * @param {Object} accounts 
 */
function saveStock(account, accounts) {
    let stockTicker = document.getElementById('editStockSymbol').textContent;
    let stockQuantity = parseFloat(document.getElementById('editStockQuantity').value);
    let stock = account.stocks.find(stock => stock.ticker === stockTicker);
    account.stocks = account.stocks.filter(stock => stock.ticker !== stockTicker);

    if (stock) {
        stock.quantity = stockQuantity;
        account.stocks.push(stock);
    } else {
        let newStock = {
            ticker: stockTicker,
            quantity: stockQuantity,
            quote: 0 // Placeholder, will be updated with API call
        }
        account.stocks.push(newStock);
    }

    retotalBalance(account);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    location.reload();

}

function saveAccount(account, accounts) {
    let newName = document.getElementById('editAccountName').value;
    let newDescription = document.getElementById('editAccountDescription').value;

    account.id = newName.split(' ').join('-').toLowerCase(); // Update account ID based on new name
    account.name = newName;
    account.description = newDescription;
    account.lastUpdated = new Date().toLocaleDateString();

    localStorage.setItem('accounts', JSON.stringify(accounts));
    location.href = `account.html?name=${account.id}`; // Redirect to updated account page
}


function deleteTransaction(account, transaction) {
    account.transactions = account.transactions.filter(t => t.dateCreated !== transaction.dateCreated);
    retotalBalance(account);
}

function deleteAccount(account) {
    let accounts = localStorage.getItem('accounts');
    accounts = JSON.parse(accounts);
    accounts = accounts.filter(acc => acc.id !== account.id);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    window.location.href = 'index.html';
}

/**
 * Recalculate the balance of the account based on its transactions and stocks.
 * @param {Object} account 
 */
function retotalBalance(account) {
    let accounts = localStorage.getItem('accounts');
    accounts = JSON.parse(accounts);
    account = accounts.find(acc => acc.id === account.id);

    account.balance = 0;
    account.transactions.forEach(transaction => {
        if (transaction.isDeposit) {
            account.balance += transaction.amount;
        } else {
            account.balance -= transaction.amount;
        }
    });

    account.stocks.forEach(stock => {
        account.balance += (stock.quantity * stock.quote);
    });

    localStorage.setItem('accounts', JSON.stringify(accounts));
}


/**
 * Generate a line chart for the account balance over time.
 * @param {Object} account 
 */
function generateLineChart(account) {
    let ctx = document.getElementById('balanceChart').getContext('2d');
    let transactions = account.transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    let labels = [];
    let data = [];
    let balance = 0;

    transactions.forEach(transaction => {
        balance += transaction.isDeposit ? transaction.amount : -transaction.amount;
        labels.push(transaction.date);
        data.push(balance);
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Account Balance Over Time',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Balance'
                    }
                }
            }
        }
    });
}
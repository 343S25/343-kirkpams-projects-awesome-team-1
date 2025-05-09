// Transactions object
// {
//     dateCreated: <Date Object>,
//     date: '2025-04-16',
//     description: 'Description 1',
//     amount: 100
//     isDeposit: true
// }

// Stock object
// {
//     ticker: 'AAPL',
//     quantity: 10,
//     quote: 15.00,
// }

// Account object
// {
//     id: 'account-name-1',
//     name: 'Account Name 1',
//     balance: 1000000,
//     lastUpdated: '4/16/2025'
//     transactions: [
//         { isDeposit: true, date: <Date Object>, description: 'Description 1', amount: 100 },
//         { isDeposit: false, date: <Date Object>, description: 'Description 2', amount: 200 },
//         { isDeposit: false, date: <Date Object>, description: 'Description 3', amount: 300 }
//     ],
//     balanceHistory: [
//         { date: <Date Object>, balance: 950000 },
//         { date: <Date Object>, balance: 980000 }
//     ],
//     stocks: [
//         { ticker: 'AAPL', shares: 10 },
//         { ticker: 'GOOGL', shares: 5 }
//     ],
//     description: 'This account is for for chocolate',
//     isAsset: 'asset' or 'liability'
// }


/**
 * Creates a div for a new account.
 * @param {string} accountName 
 * @param {Number} balance 
 * @param {string} lastUpdated 
 * @param {Array<transaction>} transactions 
 * @returns HTMLDivElement
 */
function createAccountHTML(accountName, balance, lastUpdated, transactions) {
    let accountNameId = accountName.split(' ').join('-').toLowerCase();
    // Clone the account prototype
    let accountDiv = document.getElementById('accountPrototype').cloneNode(true);
    accountDiv.id = accountNameId;
    accountDiv.classList.remove('d-none'); // Remove the hidden class

    // Account button
    let nameButton = accountDiv.querySelector('.accountName');
    nameButton.textContent = accountName; // Set the account name
    nameButton.id = accountNameId + '-name'; // Set the id for the name button
    nameButton.onclick = () => {
        window.location.href = `account.html?name=${accountNameId}`;
    };
    nameButton.onmouseover = () => nameButton.classList.add('text-secondary')
    nameButton.onmouseout = () => nameButton.classList.remove('text-secondary');

    // Balance
    let balanceElem = accountDiv.querySelector('.accountBalance');
    if (balance < 0) {
        balanceElem.textContent = `-$${Math.abs(balance).toLocaleString()}`; // Format negative balance with commas
    } else {
        balanceElem.textContent = `$${balance.toLocaleString()}`; // Format balance with commas
    }
    balanceElem.id = accountNameId + '-balance'; // Set the id for the balance element

    // Last updated
    let lastUpdatedElem = accountDiv.querySelector('.accountLastUpdated');
    lastUpdatedElem.textContent = `Last Updated: ${lastUpdated}`;
    lastUpdatedElem.id = accountNameId + '-last-updated'; // Set the id for the last updated element

    // Change expand button target
    let expandButton = accountDiv.querySelector('.expandButton');
    expandButton.setAttribute('data-bs-target', `#collapse-${accountNameId}`);
    expandButton.setAttribute('aria-controls', `collapse-${accountNameId}`);

    let collapseDiv = accountDiv.querySelector('.collapse-accountPrototype');
    collapseDiv.id = `collapse-${accountNameId}`; // Set the id for the collapse div


    // Create the transactions table
    let tbody = collapseDiv.querySelector('tbody');

    if (transactions.length === 0) {
    }
    else {
        // Add transaction rows
        transactions.slice(0, 3).forEach(transaction => {
            let transactionRow = createTransactionHTML(transaction);
            tbody.appendChild(transactionRow);
        });
    }

    // Toggle button arrow change on expand/collapse
    collapseDiv.addEventListener('shown.bs.collapse', () => {
        expandButton.innerHTML = '&#x25B2;'; // Up arrow
    });

    collapseDiv.addEventListener('hidden.bs.collapse', () => {
        expandButton.innerHTML = '&#x25BC;'; // Down arrow
    });

    return accountDiv;
}


/**
 * Adds a new account to the page and localStorage.
 */
function modalSaveAccount() {
    let warning = document.getElementById('addAccountWarning');

    let accountName = document.getElementById('accountNameInput').value;
    let startingBalance = parseFloat(document.getElementById('startingBalanceInput').value);
    let accountType = document.getElementById('accountTypeInput').value;
    let isAsset = accountType === 'asset';
    let description = document.getElementById('accountDescriptionInput').value;

    let accounts = localStorage.getItem('accounts');
    if (accounts) {
        accounts = JSON.parse(accounts);
    }
    else {
        accounts = [];
    }


    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].name.toLowerCase() === accountName.toLowerCase()) {
            warning.textContent = 'An account with this name already exists.';
            return;
        }
    }

    if (!accountName || isNaN(startingBalance) || startingBalance < 0 || !accountType) {
        warning.textContent = 'Please fill in all fields correctly.';
        return;
    }


    // From StackOverflow https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd#:~:text=The%20simplest%20way%20to%20convert,getTimezoneOffset()%20*%2060000%20))%20.
    // Get date in YYYY-MM-DD, like date input
    let date = new Date();
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset * 60 * 1000))
    date = date.toISOString().split('T')[0]

    // Starting transactions array
    let transactions = [{
        dateCreated: new Date(),
        date: date,
        description: 'Initial deposit',
        amount: startingBalance,
        isDeposit: accountType === 'asset' ? true : false,
    }];

    let id = accountName.split(' ').join('-').toLowerCase();

    accounts.push({
        id: id,
        name: accountName,
        balance: isAsset ? startingBalance : -startingBalance,
        lastUpdated: new Date().toLocaleDateString(),
        transactions: transactions,
        isAsset: isAsset,
        stocks: [],
        description: description,
    });

    localStorage.setItem('accounts', JSON.stringify(accounts));
    console.log('Accounts now:', accounts);

    // Create the new account node
    if (!isAsset) {
        startingBalance = -startingBalance; // Make the balance negative for liabilities
    }

    let accountNode = createAccountHTML(accountName, startingBalance, new Date().toLocaleDateString(), transactions);

    // Add new account to corresponding div
    if (isAsset) {
        document.getElementById('assetAccountDiv').appendChild(accountNode);
    } else {
        document.getElementById('liabilityAccountDiv').appendChild(accountNode);
    }

    // Clear the form
    document.getElementById('addAccountForm').reset();
    warning.textContent = '';

    let close = document.getElementById('saveAccountClose');
    close.click(); // Close the modal after saving
}

/** Calculates net worth then displays in the net worth element */
function displayNetWorth() {
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    let netWorth = 0;

    accounts.forEach(account => {
        netWorth += account.balance; // Add asset balances
    });

    let netWorthElem = document.getElementById('netWorthText');
    if (netWorth < 0) {
        netWorthElem.textContent = `-$${Math.abs(netWorth).toLocaleString()}`; // Format negative net worth with commas
    } else {
        netWorthElem.textContent = `$${netWorth.toLocaleString()}`; // Format net worth with commas
    }
}

/**
 * Calculate all transaction changes for the current month and display in the #thisMonthText element.
 */
function displayThisMonth() {
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    let thisMonth = new Date().getMonth();
    let thisYear = new Date().getFullYear();
    let thisMonthTotal = 0;

    accounts.forEach(account => {
        account.transactions.forEach(transaction => {
            let transactionDate = new Date(transaction.date);
            if (transactionDate.getMonth() === thisMonth && transactionDate.getFullYear() === thisYear) {
                thisMonthTotal += transaction.isDeposit ? transaction.amount : -transaction.amount;
            }
        });
    });

    let thisMonthElem = document.getElementById('thisMonthText');

    if (thisMonthTotal < 0) {
        thisMonthElem.textContent = `-$${Math.abs(thisMonthTotal).toLocaleString()}`; // Format negative total with commas
    } else {
        thisMonthElem.textContent = `$${thisMonthTotal.toLocaleString()}`; // Format total with commas
    }
}

/**
 * Calculate all transaction changes for the current year and display in the #thisYearText element.
 */
function displayThisYear() {
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    let thisYear = new Date().getFullYear();
    let thisYearTotal = 0;

    accounts.forEach(account => {
        account.transactions.forEach(transaction => {
            let transactionDate = new Date(transaction.date);
            if (transactionDate.getFullYear() === thisYear) {
                thisYearTotal += transaction.isDeposit ? transaction.amount : -transaction.amount;
            }
        });
    });

    let thisYearElem = document.getElementById('thisYearText');
    if (thisYearTotal < 0) {
        thisYearElem.textContent = `-$${Math.abs(thisYearTotal).toLocaleString()}`; // Format negative total with commas
    } else {
        thisYearElem.textContent = `$${thisYearTotal.toLocaleString()}`; // Format total with commas
    }
}

/** 
 * Export localStorage data to a JSON file.
 */
function exportData() {
    let accounts = localStorage.getItem('accounts');
    if (!accounts) {
        let warning = document.getElementById('changeDataWarning');
        warning.textContent = 'No data to export.';
        return;
    }

    accounts = JSON.parse(accounts);
    let dataStr = JSON.stringify(accounts, null, 2); // Pretty print with 2 spaces
    let blob = new Blob([dataStr], { type: 'application/json' });
    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = url;
    a.download = 'accounts.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Imports data from a JSON file into localStorage.
 */
function importData() {
    let warning = document.getElementById('changeDataWarning');

    let files = document.getElementById('importFileInput').files;
    if (files.length === 0 || files.length > 1) {
        let warning = document.getElementById('changeDataWarning');
        warning.textContent = 'Please select one file to import.';
        return;
    }

    let file = files[0];
    console.log(file);
    console.log(file.type);
    if (file.type !== 'application/json') {
        warning.textContent = 'Please select a JSON file.';
        return;
    }

    let reader = new FileReader();
    reader.onload = function () {
        try {
            let data = JSON.parse(reader.result);
            localStorage.setItem('accounts', JSON.stringify(data));
            let closeButton = document.getElementById('importExportClose');
            closeButton.click();
            displayLocalStorageData(); // Refresh the display
        } catch (error) {
            warning.textContent = 'Error importing data: ' + error.message;
        }
    };

    reader.onerror = function () {
        warning.textContent = 'Error reading file: ' + reader.error.message;
    }

    reader.readAsText(file);
}


/** Sort transactions in account by date */
function reorderTransactions(accountName) {
    let accounts = localStorage.getItem('accounts');
    accounts = JSON.parse(accounts);
    let accountNameId = accountName.split(' ').join('-').toLowerCase();
    let account = accounts.find(account => account.id === accountNameId);
    if (!account) {
        return;
    }

    // Sort transactions by date
    account.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log("Sorted transactions:", account.transactions);

    // Update localStorage
    localStorage.setItem('accounts', JSON.stringify(accounts));
}
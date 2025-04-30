// Transactions object
// {
//     id: 0,
//     date: <Date Object>,
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
    // Account name for Ids and classes
    let accountNameId = accountName.split(' ').join('-').toLowerCase();

    // Create the main container
    const accountDiv = document.createElement('div');
    accountDiv.id = accountNameId;
    accountDiv.className = 'card';

    // Create the card header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header d-flex justify-content-between align-items-center';
    accountDiv.appendChild(cardHeader);

    const accountInfo = document.createElement('div');
    accountInfo.className = 'd-flex align-items-center';
    cardHeader.appendChild(accountInfo);

    const accountNameButton = document.createElement('button');
    accountNameButton.textContent = accountName;
    accountNameButton.className = 'h2 me-3 p-2 border-0 bg-transparent text-decoration-none';
    accountNameButton.onmouseover = () => accountNameButton.classList.add('text-secondary')
    accountNameButton.onmouseout = () => accountNameButton.classList.remove('text-secondary');

    accountNameButton.onclick = () => {
        window.location.href = `account.html?name=${accountNameId}`;
    };
    accountInfo.appendChild(accountNameButton);

    const balanceElem = document.createElement('span');
    balanceElem.textContent = `$${balance.toLocaleString()}`; // Format balance with commas
    balanceElem.className = 'h2 me-3 p-3';
    accountInfo.appendChild(balanceElem);


    // Last updated text
    const lastUpdatedElem = document.createElement('span');
    lastUpdatedElem.textContent = `Last Updated: ${lastUpdated}`;
    lastUpdatedElem.className = 'text-muted ms-auto p-3';
    cardHeader.appendChild(lastUpdatedElem);

    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'btn btn-outline-secondary';
    toggleButton.type = 'button';
    toggleButton.setAttribute('data-bs-toggle', 'collapse');
    toggleButton.setAttribute('data-bs-target', `#collapse-${accountNameId}`);
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.setAttribute('aria-controls', `collapse-${accountNameId}`);
    toggleButton.innerHTML = '&#x25BC;'; // Down arrow
    cardHeader.appendChild(toggleButton);

    // Create the collapsible content
    const collapseDiv = document.createElement('div');
    collapseDiv.id = `collapse-${accountNameId}`;
    collapseDiv.className = 'collapse';
    accountDiv.appendChild(collapseDiv);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    collapseDiv.appendChild(cardBody);

    // Create the second row with transactions
    const row = document.createElement('div');
    row.className = 'row';
    cardBody.appendChild(row);


    // I decided against keeping the graph, could at it in the future for more features
    // const col1 = document.createElement('div');
    // col1.className = 'col';
    // row.appendChild(col1);

    // const graphImg = document.createElement('img');
    // graphImg.src = 'temporary-graph.png';
    // graphImg.alt = 'Graph';
    // graphImg.className = 'img-fluid';
    // col1.appendChild(graphImg);

    const col2 = document.createElement('div');
    col2.className = 'col';
    row.appendChild(col2);

    const transactionsHeader = document.createElement('p');
    transactionsHeader.textContent = 'Recent Transactions';
    transactionsHeader.className = 'h5';
    col2.appendChild(transactionsHeader);

    const transactionContainer = document.createElement('div');
    transactionContainer.className = 'container mt-2';
    col2.appendChild(transactionContainer);

    // Display transactions
    if (transactions.length === 0) {
        const noTransactions = document.createElement('div');
        noTransactions.textContent = 'No transactions available.';
        transactionContainer.appendChild(noTransactions);
    } else {
        const table = document.createElement('table');
        table.className = 'table table-bordered table-striped';
        transactionContainer.appendChild(table);

        const thead = document.createElement('thead');
        thead.className = 'table-secondary';
        table.appendChild(thead);

        const headerRow = document.createElement('tr');
        thead.appendChild(headerRow);

        // Add table headers
        ['Type', 'Date', 'Description', 'Amount'].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        // Add transaction rows
        transactions.slice(-3).forEach(transaction => {
            let transactionRow = createTransactionHTML(transaction);
            tbody.appendChild(transactionRow);
        });
    }

    // Toggle button arrow change on expand/collapse
    collapseDiv.addEventListener('shown.bs.collapse', () => {
        toggleButton.innerHTML = '&#x25B2;'; // Up arrow
    });

    collapseDiv.addEventListener('hidden.bs.collapse', () => {
        toggleButton.innerHTML = '&#x25BC;'; // Down arrow
    });

    return accountDiv;
}

function createAccountHTML2(accountName, balance, lastUpdated, transactions) {
    let accountNameId = accountName.split(' ').join('-').toLowerCase();
    // Clonse the account prototype
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
    balanceElem.textContent = `$${balance.toLocaleString()}`; // Format balance with commas
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
        transactions.slice(-3).forEach(transaction => {
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


    if (accountName && !isNaN(startingBalance) && startingBalance >= 0 && accountType) {
        // Example transactions array (empty for a new account)
        let transactions = [];

        // Create the new account node
        let accountNode = createAccountHTML(accountName, startingBalance, new Date().toLocaleDateString(), transactions);

        // Add new account to corresponding div
        if (isAsset) {
            document.getElementById('assetAccountDiv').appendChild(accountNode);
        } else {
            document.getElementById('liabilityAccountDiv').appendChild(accountNode);
        }

        // Close the modal
        let addAccountModal = bootstrap.Modal.getInstance(document.getElementById('addAccountModal'));
        addAccountModal.hide();

        // Clear the form
        document.getElementById('addAccountForm').reset();
        warning.textContent = '';

    } else {
        warning.textContent = 'Please fill in all fields correctly.';
        return;
    }

    let id = accountName.split(' ').join('-').toLowerCase();

    accounts.push({
        id: id,
        name: accountName,
        balance: startingBalance,
        lastUpdated: new Date().toLocaleDateString(),
        transactions: [],
        isAsset: isAsset,
        stocks: [],
        description: description,
    });
    localStorage.setItem('accounts', JSON.stringify(accounts));
    console.log('Accounts now:', accounts);

    let close = document.getElementById('saveAccountClose');
    close.click(); // Close the modal after saving
}

/** Calculates net worth then displays in the net worth element */
function displayNetWorth() {
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    let netWorth = 0;

    accounts.forEach(account => {
        if (account.isAsset) {
            netWorth += account.balance;
        } else {
            netWorth -= account.balance;
        }
    });

    let netWorthElem = document.getElementById('netWorthText');
    netWorthElem.textContent = `$${netWorth.toLocaleString()}`; // Format with commas
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
    thisMonthElem.textContent = `$${thisMonthTotal.toLocaleString()}`; // Format with commas
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
    thisYearElem.textContent = `$${thisYearTotal.toLocaleString()}`; // Format with commas
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
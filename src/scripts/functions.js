// Transactions object
// {
//     date: <Date Object>,
//     description: 'Description 1',
//     amount: 100
// }

// Account object
// {
//     accountName: 'Account Name 1',
//     balance: 1000000,
//     lastUpdated: <Date Object>
//     transactions: [
//         { date: <Date Object>, description: 'Description 1', amount: 100 },
//         { date: <Date Object>, description: 'Description 2', amount: 200 },
//         { date: <Date Object>, description: 'Description 3', amount: 300 }
//     ],
//     balanceHistory: [
//         { date: <Date Object>, balance: 950000 },
//         { date: <Date Object>, balance: 980000 }
//     ]
// }

function createAccountPrototype(accountName, balance, lastUpdated, transactions) {
    // Create the main container
    const accountDiv = document.createElement('div');
    accountDiv.id = accountName;
    accountDiv.className = 'd-flex flex-column border border-dark';


    // Create the inner container
    const container = document.createElement('div');
    container.className = 'p-3 container';
    accountDiv.appendChild(container);

    // Create the first row
    const row1 = document.createElement('div');
    row1.className = 'row';
    container.appendChild(row1);

    const col1 = document.createElement('div');
    col1.className = 'col';
    row1.appendChild(col1);

    const accountInfo = document.createElement('div');
    accountInfo.className = 'd-flex justify-content-around';
    col1.appendChild(accountInfo);

    const accountNameElem = document.createElement('button');
    accountNameElem.type = 'button';
    accountNameElem.textContent = accountName;
    accountNameElem.className = 'acountlink h1';
    accountInfo.appendChild(accountNameElem);

    const balanceElem = document.createElement('h2');
    balanceElem.className = 'p-2';
    balanceElem.textContent = `$${balance.toLocaleString()}`;
    accountInfo.appendChild(balanceElem);

    const col2 = document.createElement('div');
    col2.className = 'col';
    row1.appendChild(col2);

    const lastUpdatedElem = document.createElement('h2');
    lastUpdatedElem.textContent = `Last Updated: ${lastUpdated}`;
    col2.appendChild(lastUpdatedElem);

    // Create the second row
    const row2 = document.createElement('div');
    row2.className = 'row';
    container.appendChild(row2);

    const col3 = document.createElement('div');
    col3.className = 'col';
    row2.appendChild(col3);

    const graphImg = document.createElement('img');
    graphImg.src = 'images/CS343_Project1_Sketch.pdf';
    graphImg.alt = 'Graph';
    col3.appendChild(graphImg);

    const col4 = document.createElement('div');
    col4.className = 'col';
    row2.appendChild(col4);

    const transactionsHeader = document.createElement('h3');
    transactionsHeader.textContent = 'Transactions';
    col4.appendChild(transactionsHeader);

    // Create the transaction grid
    const transactionContainer = document.createElement('div');
    transactionContainer.className = 'container m-1';
    col4.appendChild(transactionContainer);

    if (transactions.length === 0) {
        const noTransactions = document.createElement('div');
        noTransactions.textContent = 'No transactions available.';
        transactionContainer.appendChild(noTransactions);
    } else {
        // Display the last 3 transactions
        transactions.slice(-3).forEach(transaction => {
            const transactionRow = document.createElement('div');
            transactionRow.className = 'row';
            transactionContainer.appendChild(transactionRow);

            transaction.forEach(cell => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'col border border-dark';
                cellDiv.textContent = cell;
                transactionRow.appendChild(cellDiv);
            });
        });
    }

    return accountDiv;
}


function modalSaveAccount() {
    const accountName = document.getElementById('accountNameInput').value;
    const startingBalance = parseFloat(document.getElementById('startingBalanceInput').value);
    const accountType = document.getElementById('accountTypeInput').value;
    const isAsset = accountType === 'asset';


    if (accountName && !isNaN(startingBalance)) {
        // Example transactions array (empty for a new account)
        const transactions = [];

        // Create the new account node
        const accountNode = createAccountPrototype(accountName, startingBalance, new Date().toLocaleDateString(), transactions);

        // Add new account to corresponding div
        if (isAsset) {
            document.getElementById('assetAccountDiv').appendChild(accountNode);
        } else {
            document.getElementById('liabilityAccountDiv').appendChild(accountNode);
        }

        // Close the modal
        const addAccountModal = bootstrap.Modal.getInstance(document.getElementById('addAccountModal'));
        addAccountModal.hide();

        // Clear the form
        document.getElementById('addAccountForm').reset();
        document.getElementById('addAccountWarning').textContent = '';

    } else {
        document.getElementById('addAccountWarning').textContent = 'Please fill in all fields correctly.';
    }
}


// const accountNode = createAccountPrototype('Account Name 1', 1000000, '4/9/2025', transactions);
// document.getElementById('assetsPrototype').appendChild(accountNode);
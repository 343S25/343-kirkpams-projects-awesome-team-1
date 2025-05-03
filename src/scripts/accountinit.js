/** Generates the HTML for the account page based on the transactions and stocks in the account
 * @param {Object} account - The account object containing transactions and stocks
 */
function displayFullAccount(account) {
    if (!account.isAsset) {
        let stocksDiv = document.getElementById('stocksDiv');
        stocksDiv.classList.add('d-none'); // Hide stocks section for liabilities
        let transactionTypeInputs = document.querySelectorAll('select[name="transactionType"]');
        console.log(transactionTypeInputs);
        transactionTypeInputs.forEach(select => {
            select.innerHTML = '<option value="Deposit" selected>Deposit</option>';
        });
    }

    let tbody = document.querySelector('tbody');
    account.transactions.forEach(transaction => {
        let transactionRow = createTransactionHTML(transaction);
        tbody.appendChild(transactionRow);
    })

    let stockTbody = document.querySelectorAll('tbody')[1];
    account.stocks.forEach(stock => {
        getStockQuote(stock.ticker).then(quote => {
            stock.quote = quote['05. price']; // Update stock quote with fetched data
            let stockRow = createStockHTML(stock);
            stockTbody.appendChild(stockRow);
        });
    });

    let accountNameElem = document.getElementById('accountName');
    let typeElem = document.getElementById('accountType');
    let balanceElem = document.getElementById('balance');
    let lastUpdatedElem = document.getElementById('lastUpdated');
    let description = document.getElementById('description');

    accountNameElem.textContent = account.name;
    typeElem.textContent = account.isAsset ? 'Type: Asset' : 'Type: Liability';
    balanceElem.textContent = `Balance: $${account.balance.toLocaleString()}`; // Format balance with commas
    lastUpdatedElem.textContent = `Last Updated: ${account.lastUpdated}`;
    if (account.description === undefined) {
        account.description = 'No description provided.';
    }
    description.textContent = `Description: ${account.description}`;


}


(function () {
    // Set max date for all date inputs to today
    // let today = new Date();
    // const offset = today.getTimezoneOffset()
    // today = new Date(today.getTime() - (offset * 60 * 1000))
    // today = today.toISOString().split('T')[0]
    // let dateInputs = document.querySelectorAll('input[type="date"]');
    // dateInputs.forEach(input => {
    //     input.setAttribute('max', today);
    // });

    // Check query string for account name
    let urlParams = new URLSearchParams(window.location.search);
    let accountNameId = urlParams.get('name');

    if (!accountNameId) {
        document.querySelector('body').innerHTML = '<h1>Account not found</h1>';
        return;
    }

    // Check localStorage for account
    let accounts = localStorage.getItem('accounts');
    accounts = JSON.parse(accounts);
    if (!accounts) {
        document.querySelector('body').innerHTML = '<h1>Account not found</h1>';
        return;
    }
    let account = accounts.find(account => account.id === accountNameId);
    if (!account) {
        document.querySelector('body').innerHTML = '<h1>Account not found</h1>';
        return;
    }

    // If account is liability

    // Order transactions
    reorderTransactions(accountNameId);
    retotalBalance(account);

    // Create HTML for account
    displayFullAccount(account);

    document.querySelector('title').textContent = `${account.name}`;


    // Add button event listeners
    document.getElementById('addTransactionButton').addEventListener('click', function (event) {
        event.preventDefault();
        addTransaction(accountNameId);
    });

    document.getElementById('addStockButton').addEventListener('click', function (event) {
        event.preventDefault();
        addStock(accountNameId);
    });


    // Edit button event listener
    document.getElementById('editAccountButton').addEventListener('click', function (event) {
        fillAccountEditModal(account);
    });

    document.getElementById('saveEditAccountButton').addEventListener('click', function (event) {
        saveAccount(account, accounts);
    });

    document.getElementById('editTransactionButton').addEventListener('click', function (event) {
        transaction = saveTransaction(account, accounts);
    });


    // Delete account button
    document.getElementById('confirmDeleteAccountButton').addEventListener('click', function (event) {
        deleteAccount(account);
    });

    // Delete stock button
    document.getElementById('deleteStockButton').addEventListener('click', function (event) {
        let stockTicker = document.getElementById('editStockSymbol').textContent;
        account.stocks = account.stocks.filter(stock => stock.ticker !== stockTicker);
        localStorage.setItem('accounts', JSON.stringify(accounts));
        location.reload();
    });

    // Delete transaction button
    document.getElementById('deleteTransactionButton').addEventListener('click', function (event) {
        let dateCreated = JSON.parse(document.getElementById('dateCreatedID').textContent);
        account.transactions = account.transactions.filter(transaction => transaction.dateCreated !== dateCreated);
        localStorage.setItem('accounts', JSON.stringify(accounts));
        location.reload();
    });



})();
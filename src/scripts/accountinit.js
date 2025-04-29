/** Generates the HTML for the account page based on the transactions and stocks in the account
 * @param {Object} account - The account object containing transactions and stocks
 */
function displayFullAccount(account) {
    let tbody = document.querySelector('tbody');
    account.transactions.forEach(transaction => {
        let transactionRow = createTransactionHTML(transaction);
        tbody.appendChild(transactionRow);
    })

    let stockTbody = document.querySelectorAll('tbody')[1];
    account.stocks.forEach(stock => {
        let stockRow = createStockHTML(stock);
        stockTbody.appendChild(stockRow);
    });

    let typeElem = document.getElementById('accountType');
    let balanceElem = document.getElementById('balance');
    let lastUpdatedElem = document.getElementById('lastUpdated');
    let description = document.getElementById('description');

    typeElem.textContent = account.isAsset ? 'Type: Asset' : 'Type: Liability';
    balanceElem.textContent = `Balance: $${account.balance.toLocaleString()}`; // Format balance with commas
    lastUpdatedElem.textContent = `Last Updated: ${account.lastUpdated}`;
    if (account.description === undefined) {
        account.description = 'No description provided.';
    }
    description.textContent = `Description: ${account.description}`;


}


(function () {
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

    // Create HTML for account
    displayFullAccount(account);

    document.querySelector('title').textContent = `${account.name}`;

    document.getElementById('addTransactionButton').addEventListener('click', function (event) {
        event.preventDefault();
        addTransaction(accountNameId);
    });

    document.getElementById('addStockButton').addEventListener('click', function (event) {
        event.preventDefault();
        addStock(accountNameId);
    });

})();
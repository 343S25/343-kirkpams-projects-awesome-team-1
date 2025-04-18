function displayFullAccount(account) {

}


(function () {
    // Check query string for account name
    let urlParams = new URLSearchParams(window.location.search);
    let accountNameId = urlParams.get('name');

    if (!accountNameId) {
        document.querySelector('body').innerHTML = '<h1>Account not found</h1>';
        return;
    }

    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let account = accounts.find(account => account.id === accountNameId);
    if (!account) {
        document.querySelector('body').innerHTML = '<h1>Account not found</h1>';
        return;
    }

    document.querySelector('title').textContent = `${account.name}`;

    document.getElementById('addTransactionButton').addEventListener('click', function (event) {
        addTransaction(accountNameId);
    });

    document.getElementById('addStockButton').addEventListener('click', function (event) {
        addStock(accountNameId);
    });

})();
// Searches localStorage for accounts and display them if they exist.
function displayLocalStorageData() {
    let accounts = localStorage.getItem('accounts');
    if (accounts) {
        accounts = JSON.parse(accounts);
        let assetDiv = document.getElementById('assetAccountDiv');
        let liabilityDiv = document.getElementById('liabilityAccountDiv');
        accounts.forEach(account => {
            if (account.isAsset) {
                assetDiv.appendChild(createAccountPrototype(account.accountName, account.balance, account.lastUpdated, account.transactions));
            }
            else {
                liabilityDiv.appendChild(createAccountPrototype(account.accountName, account.balance, account.lastUpdated, account.transactions));
            }
        });
    }
}


// Initialization
(function () {
    // localStorage.clear(); // For testing
    document.getElementById('saveAccountButton').addEventListener('click', modalSaveAccount);
    displayLocalStorageData();

})();
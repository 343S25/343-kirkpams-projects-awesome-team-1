/** Searches localStorage for accounts and display them if they exist.*/
function displayLocalStorageData() {
    let accounts = localStorage.getItem('accounts');
    if (accounts) {
        accounts = JSON.parse(accounts);
        let assetDiv = document.getElementById('assetAccountDiv');
        let liabilityDiv = document.getElementById('liabilityAccountDiv');
        accounts.forEach(account => {
            if (account.isAsset) {
                assetDiv.appendChild(createAccountHTML(account.name, account.balance, account.lastUpdated, account.transactions));
            }
            else {
                liabilityDiv.appendChild(createAccountHTML(account.name, account.balance, account.lastUpdated, account.transactions));
            }
        });
    }

    displayNetWorth();
    displayThisMonth();
    displayThisYear();
}


// Initialization
(function () {
    document.getElementById('saveAccountButton').addEventListener('click', function (event) {
        event.preventDefault();
        modalSaveAccount();
        displayNetWorth();
    });

    document.getElementById('importButton').addEventListener('click', function (event) {
        event.preventDefault();
        importData();
    });

    document.getElementById('exportButton').addEventListener('click', function (event) {
        exportData();
    });

    document.getElementById('clearDataButton').addEventListener('click', function (event) {
        localStorage.clear();
        // Refresh page
        location.reload();
    });



    displayLocalStorageData();

})();
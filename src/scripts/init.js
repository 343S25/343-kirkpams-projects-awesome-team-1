// Searches localStorage for accounts and display them if they exist.
function displayLocalStorageData() {
    let accounts = localStorage.getItem('accounts');
    if (accounts) {
        accounts = JSON.parse(accounts);
        let assetDiv = document.getElementById('assetAccountDiv');
        let liabilityDiv = document.getElementById('liabilityAccountDiv');
        accounts.forEach(account => {
            // TODO
        });
    }
}
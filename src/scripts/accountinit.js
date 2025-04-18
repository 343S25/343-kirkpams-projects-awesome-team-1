function displayFullAccount(account) {

}


(function () {
    // Check query string for account name
    const urlParams = new URLSearchParams(window.location.search);
    const accountName = urlParams.get('name');

    document.querySelector('title').textContent = `${accountName}`;

    if (!accountName) {

    }
})
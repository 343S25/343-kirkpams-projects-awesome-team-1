const API_KEY = '8FOIK4FTAICVFHV5';


/**
 * Get a stock quote for a given symbol. Use the Alpha Vantage API.
 * @param {string} symbol 
 */
async function getStockQuote(symbol) {
    console.log('Fetching stock quote for:', symbol);
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`

    let response = await fetch(url);
    data = await response.json();
    return data['Global Quote'];
    //     .then(data => {
    //     console.log(data);
    //     console.log(data['Global Quote']);
    //     return data['Global Quote'];
    // })
    //     .catch(error => console.error('Error fetching stock data:', error));
}


/**
 * Fetch stock quotes for multiple tickers.
 * @param {string[]} tickers - Array of stock tickers.
 * @returns {Promise<Object[]>} - Array of stock quote objects.
 */
async function fetchStockQuotes(tickers) {
    let fetchPromises = tickers.map(ticker => getStockQuote(ticker));
    try {
        let quotes = await Promise.all(fetchPromises);
        return quotes;
    } catch (error) {
        console.error('Error fetching stock quotes:', error);
        throw error;
    }
}


/**
 * Update stock values and account balances in the UI.
 */
async function updateStockValues() {
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    for (let account of accounts) {
        if (account.stocks && account.stocks.length > 0) {
            let tickers = account.stocks.map(stock => stock.ticker);
            try {
                let quotes = await fetchStockQuotes(tickers);
                quotes.forEach((quote, index) => {
                    const stock = account.stocks[index];
                    stock.quote = parseFloat(quote['05. price']);
                });

                // Update account balance
                account.balance = account.transactions.reduce((total, t) => {
                    return total + (t.isDeposit ? t.amount : -t.amount);
                }, 0);
                account.stocks.forEach(stock => {
                    account.balance += stock.quantity * stock.quote;
                });

                // Update localStorage
                localStorage.setItem('accounts', JSON.stringify(accounts));

                // Update UI
                location.reload();
            } catch (error) {
                console.error('Error updating stock values:', error);
            }
        }
    }
}
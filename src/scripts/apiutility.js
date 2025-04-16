const API_KEY = '8FOIK4FTAICVFHV5';


// String symbol
function getStockQuote(symbol) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Do stuff with data
        })
        .catch(error => console.error('Error fetching stock data:', error));
}
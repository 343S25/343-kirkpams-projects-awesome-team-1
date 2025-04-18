const API_KEY = '8FOIK4FTAICVFHV5';


/**
 * Get a stock quote for a given symbol. Use the Alpha Vantage API.
 * @param {string} symbol 
 */
async function getStockQuote(symbol) {
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
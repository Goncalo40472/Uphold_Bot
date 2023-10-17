import { checkPriceOscillation } from './bot.js';

// Set the currency pairs to check
const currencyPairs = ['BTC-USD', 'ETH-USD', 'LTC-USD', 'BCH-USD', 'XRP-USD'];
// Set the fetch interval in seconds
const fetchInterval = 5;
// Set the threshold in percentage points
const threshold = 0.01; 

// Schedule the function to run for each currency pair at regular intervals
currencyPairs.forEach((pair) => {
    setInterval(() => checkPriceOscillation(pair, threshold), fetchInterval * 1000);
  });
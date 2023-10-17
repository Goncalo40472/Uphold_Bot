import axios from "axios";

var lastTriggeredRate = 0; 

export async function checkPriceOscillation(currencyPair, threshold) {

  try {
    const response = await axios.get(`https://api.uphold.com/v0/ticker/${currencyPair}`);
    const currentRate = response.data.ask;

    if(lastTriggeredRate === 0) lastTriggeredRate = currentRate;

    // Check the percentage difference between the current rate and the last triggered rate
    const percentageDif = Math.abs(currentRate - lastTriggeredRate) / lastTriggeredRate;

    // Check if the percentage difference is greater than the threshold
    if (percentageDif > threshold) {
        console.log(`${currencyPair} price ocilated by ${percentageDif}%!\nLast rate: ${lastTriggeredRate}\nCurrent rate: ${currentRate}\n`);
        lastTriggeredRate = currentRate;
    }

    return percentageDif;

  } catch (error) {
    console.error('Error fetching price data:', error);
  }
};
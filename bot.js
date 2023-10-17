import axios from "axios";

import pg from 'pg';
const { Pool } = pg;

var lastTriggeredRate = 0; 

const database = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'uphold_bot_db',
  password: '0811',
  port: 5432,
});

export async function checkPriceOscillation(currencyPair, threshold) {

  try {

    // Retrieve the rates of a currency pair
    const response = await axios.get(`https://api.uphold.com/v0/ticker/${currencyPair}`);
    const currentRate = response.data.ask;

    if(lastTriggeredRate === 0) lastTriggeredRate = currentRate;

    // Check the percentage difference between the current rate and the last triggered rate
    const percentageDif = Math.abs(currentRate - lastTriggeredRate) / lastTriggeredRate;

    // Check if the percentage difference is greater than the threshold
    if (percentageDif > threshold) {
        console.log(`${currencyPair} price ocilated by ${percentageDif}%!\nLast rate: ${lastTriggeredRate}\nCurrent rate: ${currentRate}\n`);

        // Inserts the alert in to the database
        const timestamp = new Date();
        insertData(currentRate, lastTriggeredRate, timestamp, currencyPair);

        // Updates the last triggered rate
        lastTriggeredRate = currentRate;
    }

  } catch (error) {
    console.error('Error fetching price data:', error);
  }
};


// Function to insert data into the database
const insertData = async (currentRate, lastRate, timestamp, currencyPair) => {

  const insertQuery = `
      INSERT INTO alerts (current_rate, last_rate, timestamp, currency_pair)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
  `;

  try {
      const result = await database.query(insertQuery, [currentRate, lastRate, timestamp, currencyPair]);
      const insertedRowId = result.rows[0].id;
      console.log(`Data inserted with ID: ${insertedRowId}`);
  } catch (error) {
      console.error('Error inserting data:', error);
  }
};

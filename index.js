require('dotenv').config()
const express = require('express');
const axios = require('axios'); // Corrected spelling
const Redis = require("ioredis");

const app = express();

const redis = new Redis({
  password: process.env.password,
  host: process.env.host,
  port: process.env.port
})

app.get('/', async (req, res) => {
  try {
    const cacheValue = await redis.get('data');
    console.log('Working')
    if (cacheValue) {
      console.log('Serving data from cache'); // Log cache hit
      return res.json(JSON.parse(cacheValue));
    }

    console.log('Fetching data from external API'); // Log API call
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos/");
    await redis.set('data', JSON.stringify(data));
    await redis.expire('data', 30); // Set cache expiration to 30 seconds
    return res.json(data);
  } catch (error) {
    console.error('Error:', error); // Handle potential errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
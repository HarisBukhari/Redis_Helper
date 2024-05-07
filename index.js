const express = require('express')
const aixos = require('axios')
const Redis = require("ioredis");
const redis = new Redis();
const app = express()

app.get('/', async (req, res) => {
  const cacheValue = await redis.get('data')
  if(cacheValue) return res.json(JSON.parse(cacheValue))
  const {data} = await aixos.get("https://jsonplaceholder.typicode.com/todos/")
  await redis.set('data',JSON.stringify(data))
  await redis.expire('data',30)
  return res.json(data)
})

app.listen('3000', () => {
  console.log('Listening on port 3000')
})
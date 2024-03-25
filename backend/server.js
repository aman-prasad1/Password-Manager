const express = require('express')
const {MongoClient} = require('mongodb')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const cors = require('cors')


dotenv.config()
console.log(process.env)
const app = express()
const port = 3000
app.use(bodyparser.json())
app.use(cors())

const url = "mongodb://localhost:27017"
const client = new MongoClient(url)
const dbName = 'mypass'

client.connect();

// to get all passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

// to save a passsword
app.post('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password)
    res.send({success : true})
})

// to delete a password
app.delete('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password)
    res.send({success : true})
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
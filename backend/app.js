const express = require('express')
const app = express()
const router = require('./routes')
const db = require('./db')

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.use(router)

app.listen(3000)
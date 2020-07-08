const express = require('express')
const app = express()
const router = require('./routes')
const db = require('./db')
const cors = require('cors')

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.use(cors({origin:'http://localhost:8080'}))
app.use(router)

app.listen(3000)
const express = require('express')
const app = express()
const router = require('./routes')
const db = require('./db')
const cors = require('cors')

const server = require('http').createServer(app)
const io = require('socket.io')(server);
const socketConnections  = require('./sockets')(io)


app.get('/', function (req, res) {
    res.send('Hello World')
})

app.use(cors({origin:'http://localhost:8080'}))
app.use(router)

server.listen(3000)
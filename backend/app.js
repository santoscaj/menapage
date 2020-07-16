const express = require('express')
const app = express()
const router = require('./routes')
const db = require('./db')
const cors = require('cors')
const bodyParser = require('body-parser')


const server = require('http').createServer(app)
const io = require('socket.io')(server);
const socketConnections  = require('./sockets')(io)

app.use(bodyParser.json())
app.use(cors({origin:['http://localhost:8080','http://127.0.0.1:8887','https://meni-love.web.app' , 'http://meni-love.web.app']}))
app.use(router)

server.listen(3000)
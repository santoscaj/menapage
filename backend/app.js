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
app.use(cors({origin:['http://localhost:8080',
                    'https://gaminob.santosaj.com','http://gaminob.santosaj.com' ,
                    'https://adminmenapage.santosaj.com','http://adminmenapage.santosaj.com'    ]}))
app.use(router)

server.listen(3000)
// const { Sequelize, Model, DataTypes } = require('sequelize');
// const { setupMaster } = require('cluster');
// const moment = require('moment')

const mongoose =require('mongoose')
let LOG = false

// const dbipaddr = 'localhost'
const dbipaddr = 'database'
const database = 'menipage';


const logger = (message)=>{
  // if(debug)
  //   console.log(message)
}

mongoose.connect(`mongodb://${dbipaddr}:27017/${database}`, {logger:logger, loggerLevel: 'error'})
mongoose.set('debug', false);
const albumSchema = new mongoose.Schema({
  id: {type: Number, required: true, unique: true, immutable: true},
  dirname: String, 
  day: Number,
  fotos: [{
    id: {type: Number, required: true, unique: true, immutable: true}, 
    filename: String, 
    date: String,
    position: Number,
    prize: Boolean,    
    caption: String
  }]
})

const messageSchema = new mongoose.Schema({
  id: { type: Number, required: true ,  unique: true, immutable: true},
  content: String,
  user_id : { type: Number, required: true },
  is_delivered:  {type: Boolean, default: false},
  is_read:  {type: Boolean, default: false},
  datetime: { type: Date, required: true }
})

const userSchema = new mongoose.Schema({
  id: {type: Number, required: true, unique: true, immutable: true},
  name: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  alias: String,
  guest: {type: Boolean, default: true},
  admin: {type: Boolean, default: false}
})

const Album = mongoose.model('Album', albumSchema)
const User =  mongoose.model('User', userSchema)
const Message =  mongoose.model('Message', messageSchema)


module.exports = {Album, User, Message}

try{
  addDefaultDbValues = require('./dbDefaults')
  addDefaultDbValues()
}catch(e){
  console.log(e)
}




// const { Sequelize, Model, DataTypes } = require('sequelize');
// const { setupMaster } = require('cluster');
// const moment = require('moment')

const mongoose =require('mongoose')
let LOG = false

const dbipaddr = 'localhost'
// const dbipaddr = 'database'
const database = 'menipage';
const username = 'postgres';
const password = 'berto';

mongoose.connect(`mongodb://${dbipaddr}:27017/${database}`)

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

const userSchema = new mongoose.Schema({
  id: {type: Number, required: true, unique: true, immutable: true},
  name: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  alias: String,
  guest: {type: Boolean, default: false}
})

const Album = mongoose.model('Album', albumSchema)
const User =  mongoose.model('User', userSchema)


module.exports = {Album, User}

try{
  addDefaultDbValues = require('./dbDefaults')
  addDefaultDbValues()
}catch(e){
  console.log(e)
}




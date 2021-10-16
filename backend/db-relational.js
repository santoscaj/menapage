const fs = require('fs')
const { Sequelize, Model, DataTypes } = require('sequelize');
const { setupMaster } = require('cluster');
const moment = require('moment')

let LOG = false

// const dbipaddr = 'localhost'
const dbipaddr = 'database'
const database = 'menipage';
const username = 'postgres';
const password = 'berto';
const sequelize = new Sequelize(database,username,password,{
    host: dbipaddr,
    dialect: 'postgres',
    logging: message=>{if(LOG) console.log(message)}
})


function getDirectories(path) {
  let fotoAlbums = []
  // Dates > Albums > Fotos
  fs.readdirSync(path)
    .filter(dir => fs.statSync(path+'/'+dir).isDirectory())
    .forEach(day => {
      // Directories with Albmums
      let albumPath = path+'/'+day
      fs.readdirSync(albumPath)
        .filter(dir => fs.statSync(albumPath+'/'+dir).isDirectory())
        .forEach(dir =>{
          // Directories with Fotos
          let fotoPath = albumPath+'/'+dir
          // console.log(sizeOf(fotoPath))
          fotoAlbums.push({day, dirname: dir, fotos: fs.readdirSync(fotoPath )})
        })
    })
  return fotoAlbums
}

async function createUsers(){
  try{
    await User.findOrCreate({where: {name: 'Alberto Santos', alias: 'Berto', is_admin: true}})
    await User.findOrCreate({where: {name: 'Brenda Gamino', alias: 'Meni'}})
    await User.findOrCreate({where: {name: 'Visitor', alias: 'Visitor'}})
  }catch(err){console.error(err)}
}


async function addFakeMessages(){
  try{
    await Message.findOrCreate({where: {content: 'Hi', user_id: 1}})
    await Message.findOrCreate({where: {content: 'Hello there', user_id: 2}})
    await Message.findOrCreate({where: {content: 'I will test emojis', user_id: 1}})
    await Message.findOrCreate({where: {content: 'Emoji test ✌', user_id: 1}})
    await Message.findOrCreate({where: {content: 'Tesla, Inc. is an American electric vehicle and clean energy company based in Palo Alto', user_id: 2}})
    await Message.findOrCreate({where: {content: 'I will test longer texts: Tesla, Inc. is an American electric vehicle and clean energy company based in Palo Alto, California. The company specializes in electric vehicle manufacturing, battery energy storage from home ', user_id: 1}})
  }catch(err){console.error(err)}
}

let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
function getDate(filename){
  try{
    let date = filename.match(/[_-]\d{8}[_-]/) || filename.match(/\d{8}/) || filename.match(/\d{4}-\d{2}-\d{2}/) 
    if(!date) return 'invalid date'
    date = date[0].replace(/[-_]/g, '')
    let y = date.substr(0,4), m = Number(date.substr(4,2)-1), d = date.substr(6,2)
    let dateString = `${months[m]} ${d}, ${y}` || 'invalid date'
    return dateString
  }catch(e){
    console.log(e, filename, y,m,d)
    return 'error date'
  }
}

function getPrize(filename){
  return /prize/.test(filename)
}

async function addAlbumsToDb(albums){
  printedAlready = false
  for (let album of albums){
    try{
      let {dirname, day} = album
      let dbAlbum = await Album.findOrCreate({where:{ dirname, day }})
      for(let foto of album.fotos){
        let date = getDate(foto)
        let prize = getPrize(foto)
        if(prize)
          await Foto.findOrCreate({where:{date, prize, caption: 'Surprise picture of the day' , filename:foto, album_id: dbAlbum[0].id}})
        else
          await Foto.findOrCreate({where:{date, prize, filename:foto, album_id: dbAlbum[0].id}})
      }
    }catch(err){
      if(err.message=='Validation error' && !printedAlready){
        console.log('One or more default users have been modified')
        printedAlready =true
      }else if(err.message!='Validation error')
        console.error(err.message)
    }
  }
}

class Foto extends Model {}
class Album extends Model {}

Album.init({
  dirname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: DataTypes.STRING, 
  day: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
}, { sequelize, modelName: 'album' });
    

Foto.init({
  filename: {
      type: DataTypes.STRING,
      allowNull: false
  },
  date: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  position: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  // visited: {
  //     type: DataTypes.BOOLEAN,
  //     defaultValue: false
  // },
  prize: {
    type: DataTypes.BOOLEAN, 
    defaultValue: false,
  },    
  album_id: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    onDelete: 'CASCADE',
    references: {
        model: Album, 
        key: 'id'
    }
  },
  caption: {
    type: DataTypes.STRING, 
    defaultValue: '' 
  }
}, { sequelize, modelName: 'foto' }
);

Foto.Album = Foto.belongsTo(Album, {foreignKey: 'album_id', constraints: false});
Album.Fotos = Album.hasMany(Foto, {foreignKey: 'album_id', constraints: false});


class Message extends Model {}
class User extends Model {}

User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alias: DataTypes.STRING, 
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, { sequelize, modelName: 'user' });
    

Message.init({
  content: {
      type: DataTypes.STRING,
      allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    onDelete: 'CASCADE',
    references: {
        model: User, 
        key: 'id'
    }
  },
  is_delivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, { sequelize, modelName: 'message' }
);


Message.User = Message.belongsTo(User, {foreignKey: 'user_id', constraints: false});
User.Messages = User.hasMany(Message, {foreignKey: 'user_id', constraints: false});

module.exports = {Foto, Album, Sequelize, sequelize, Message, User}


let albums = getDirectories('./images')

async function setup(){
  await sequelize.sync()
  await addAlbumsToDb(albums)
  await createUsers()
  // await addFakeMessages()
}

setup()

// ;(async ()=>{
//   let data  = await Foto.findAll({where:{}, include: {model: Album, where:{day:11} }})
//   let cleanData = data.map(f=>f.filename)
//   dbAlbum = await Album.findOne({where:{day:11}, include:Foto})
// })()

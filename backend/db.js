const fs = require('fs')
const { Sequelize, Model, DataTypes } = require('sequelize');


let LOG = false

const sequelize = new Sequelize('menipage','postgres','berto',{
    host: 'localhost',
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
    await User.findOrCreate({where: {name: 'Alberto Santos', alias: 'Berto'}})
    await User.findOrCreate({where: {name: 'Brenda Gamino', alias: 'Meni'}})
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

async function addAlbumsToDb(albums){
  printedAlready = false
  for (let album of albums){
    try{
      let {dirname, day} = album
      let dbAlbum = await Album.findOrCreate({where:{ dirname, day }})
      for(let foto of album.fotos){
        await Foto.findOrCreate({where:{filename:foto, album_id: dbAlbum[0].id}})
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
  // id:{
  //   type: DataTypes.UUID, 
  //   primaryKey: true,
  //   allowNull: false, 
  // }, 
  dirname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: DataTypes.STRING, 
  day: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
  prize: {
    type: DataTypes.BOOLEAN, 
    defaultValue: false,
  }
}, { sequelize, modelName: 'album' });
    

Foto.init({
  // id: {
  //     type: DataTypes.UUID, 
  //     primaryKey: true,
  //     allowNull: false,
  // },
  filename: {
      type: DataTypes.STRING,
      allowNull: false
  },
  date: {
    type: DataTypes.STRING,
    defaultValue: ''
},
  visited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
  }
}, { sequelize, modelName: 'message' }
);

Message.User = Message.belongsTo(User, {foreignKey: 'user_id', constraints: false});
User.Messages = User.hasMany(Message, {foreignKey: 'user_id', constraints: false});

sequelize.sync()

module.exports = {Foto, Album, Sequelize, sequelize, Message, User}

let albums = getDirectories('./images')
addAlbumsToDb(albums)
createUsers()
addFakeMessages()

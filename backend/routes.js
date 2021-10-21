const express = require('express')
const router = express.Router()
const {Album, User} = require('./db')
const bcrypt = require('bcryptjs')

router.get('/fotos/:id', async (req, res)=>{
    if(!req.params.id) res.sendStatus(401)
    try{
        let dbFotoAlbum = await Album.findOne( { "fotos.id" : req.params.id })
        console.log(dbFotoAlbum)
        if(!dbFotoAlbum) return res.sendStatus(404)
        let dbFoto = dbFotoAlbum.fotos.filter(foto=>foto.id == req.params.id )[0]
        let {dirname, day} = dbFotoAlbum
        let { filename } = dbFoto
        res.sendFile(`${__dirname}/images/${day}/${dirname}/${filename}`)
    }catch(err){
        console.error(err)
        res.sendStatus(500)
    }
})

// let fotoFieldsToUpdate = ['caption', 'date', 'position']

router.put('/fotoinfo/:id', async (req, res)=>{
    if(!req.params.id) res.sendStatus(401)

    try{
        // let dbFoto = await Foto.update(req.body, {where:{id:req.params.id}})
        let dbFoto = Album.findOneAndUpdate( 
            { "fotos.id" : req.params.id },
            {'fotos.$[element].name': 'yay'},
            {arrayFilters: [{ 'element.id': req.params.id }]}
            )
        if(!dbFoto) return res.sendStatus(404)
        // let updatedFoto = await Foto.findOne({where:{id:req.params.id}})
        let updatedFoto = await Album.findOne( { "fotos.id" : req.params.id }).select({fotos: {$elemMatch: {id: req.params.id}}})[0]
        res.json(updatedFoto)
    }catch(err){
        console.error(err)
        res.sendStatus(500)
    }
})


// router.get('/users', async (req, res)=>{
//     let query = req.query || {}
//     let user = await User.findAll({where:query})
//     if(!user) res.sendStatus(404)
//     res.json(user)
// })

router.post('/login', async (req, res)=>{
    let userData = req.body
    try{
      let dbUser = await User.findOne({$or: [
        {name: userData.username},
        {alias: userData.username}
      ]})
  
      if(!dbUser)
        return res.sendStatus(404)
      if(!bcrypt.compareSync(userData.password,dbUser.password))
        return res.sendStatus(401)
    //   let accessToken = jwt.sign({id: dbUser.id}, process.env.ACCESS_TOKEN_SECRET)
      let {name, alias, guest} = dbUser
      res.status(200).send({auth:true, user: {name,alias,guest}})
    }catch(e){  
      console.error(e)
      return res.sendStatus(500)
    }
})

router.get('/albums', async (req, res)=>{
    try{
        // let dbAlbum = await Album.findAll({order:['day'], include:Foto})
        let dbAlbum =  await Album.find({},null, {sort: {day: 1}})
        if(!dbAlbum) res.sendStatus(404)
        res.json(dbAlbum)
    }catch(err){
        console.error(err)
        res.sendStatus(500)
    }
})

router.get('/fotoinfo', async (req, res)=>{
    let query = req.query || {}
    // let foto = await Foto.findAll({where:query, include: Album})
    let foto = await Album.find( query ).select({fotos: {$elemMatch: {id: req.params.id}}}).fotos
    if(!foto) res.sendStatus(404)
    res.json(foto)
})



router.get('/fotoinfo/:id', async (req, res)=>{
    if(!req.params.id) return res.sendStatus(400)
    // let foto = await Foto.findOne({where:{id: req.params.id}})
    let fotoAlbum = await Album.findOne( {'fotos.id': req.params.id } ).select({fotos: {$elemMatch: {id: req.params.id}}})
    if(!fotoAlbum || ! fotoAlbum.fotos.length) res.sendStatus(404)
    let foto = fotoAlbum.fotos[0]
    res.json(foto)
})


router.get('/album_of_the_day/:day', async (req, res)=>{
    if(!req.params.day) return res.sendStatus(401)
    dbAlbum = await Album.findOne({day:req.params.day})
    if(!dbAlbum) return res.sendStatus(404)
    res.json(dbAlbum)
})


router.get('/fotos_of_the_day/:day', async (req, res)=>{
    if(!req.params.day) return res.sendStatus(401)
    let fotoAlbum = await Album.findOne({day:req.params.day},['fotos'])
    // fotos = await Foto.findAll({where:{}, order:['position'], include: {model: Album, where:{day:req.params.day} }})
    if(!fotoAlbum || !fotoAlbum.fotos.length) return res.sendStatus(404)
    let fotos = fotoAlbum.fotos.sort((a,b)=>a.position - b.position )
    res.json(fotos)
})

module.exports = router
const express = require('express')
const router = express.Router()
const {Album, Foto, User} = require('./db')

// router.get('/albums/:album_id', async (req, res)=>{
//     if(!req.params.album_id) res.sendStatus(401)
//     try{
//         let dbAlbum = await Album.findOne({where:{id:req.params.album_id}})
//         let {dirname, day} = dbAlbum
//         res.sendFile(`images/${day}/${dirname}`)
//     }catch(err){
//         console.error(err)
//         res.sendStatus(500)
//     }
// })

router.get('/fotos/:id', async (req, res)=>{
    if(!req.params.id) res.sendStatus(401)
    try{
    let dbFoto = await Foto.findOne({where:{id:req.params.id }, include: Album})
        if(!dbFoto) return res.sendStatus(404)
        let { filename } = dbFoto
        let {dirname, day} = dbFoto.album
        res.sendFile(`${__dirname}/images/${day}/${dirname}/${filename}`)
    }catch(err){
        console.error(err)
        res.sendStatus(500)
    }
})

let fotoFieldsToUpdate = ['caption', 'date', 'position']

router.put('/fotoinfo/:id', async (req, res)=>{
    if(!req.params.id) res.sendStatus(401)

    try{
        let dbFoto = await Foto.update(req.body, {where:{id:req.params.id}})
        if(!dbFoto) return res.sendStatus(404)
        let updatedFoto = await Foto.findOne({where:{id:req.params.id}})
        res.json(updatedFoto)
    }catch(err){
        console.error(err)
        res.sendStatus(500)
    }
})

router.get('/users', async (req, res)=>{
    let query = req.query || {}
    let user = await User.findAll({where:query})
    if(!user) res.sendStatus(404)
    res.json(user)
})

router.get('/albums', async (req, res)=>{
    try{
        let dbAlbum = await Album.findAll({order:['day'], include:Foto})
        if(!dbAlbum) res.sendStatus(404)
        res.json(dbAlbum)
    }catch(err){
        console.error(err)
        res.sendStatus(500)
    }
})

router.get('/fotoinfo', async (req, res)=>{
    let query = req.query || {}
    let foto = await Foto.findAll({where:query, include: Album})
    if(!foto) res.sendStatus(404)
    res.json(foto)
})

router.get('/fotoinfo/:id', async (req, res)=>{
    if(!req.params.id) return res.sendStatus(400)
    let foto = await Foto.findOne({where:{id: req.params.id}})
    if(!foto) res.sendStatus(404)
    res.json(foto)
})

router.get('/album_of_the_day/:day', async (req, res)=>{
    if(!req.params.day) return res.sendStatus(401)
    dbAlbum = await Album.findOne({where:{day:req.params.day}, include:{model:Foto, order:['position']}})
    if(!dbAlbum) return res.sendStatus(404)
    res.json(dbAlbum)
})


router.get('/fotos_of_the_day/:day', async (req, res)=>{
    if(!req.params.day) return res.sendStatus(401)
    fotos = await Foto.findAll({where:{}, include: {model: Album, where:{day:req.params.day} }})
    if(!fotos) return res.sendStatus(404)
    res.json(fotos)
})

module.exports = router
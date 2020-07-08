const express = require('express')
const router = express.Router()
const {Album, Foto} = require('./db')

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

router.get('/fotos/:foto_id', async (req, res)=>{
    if(!req.params.foto_id) res.sendStatus(401)
    try{
        let dbFoto = await Foto.findOne({where:{id:req.params.foto_id}, include: Album})
        if(!dbFoto) return res.sendStatus(404)
        let { filename } = dbFoto
        let {dirname, day} = dbFoto.album
        console.log(dbFoto)
        // res.sendStatus(200)
        // console.log(day, dirname, filename)
        res.sendFile(`${__dirname}/images/${day}/${dirname}/${filename}`)
    }catch(err){
        console.error(err)
        res.sendStatus(500)
    }
})

module.exports = router
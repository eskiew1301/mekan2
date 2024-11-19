const mongoose = require('mongoose')

const Schema = mongoose.Schema


const gallerySchema = new Schema({
    photos: [{type: String, required:true}],
   
},{timestamps: true})


module.exports=mongoose.model('Gallery', gallerySchema)
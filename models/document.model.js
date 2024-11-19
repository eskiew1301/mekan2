const mongoose = require('mongoose')

const Schema = mongoose.Schema


const pdfDocumentSchema = new Schema({
    title: {type: String, required:true},
    document: {type: String, required:true},
   
},{collection: "PdfDocument"})


module.exports=mongoose.model('PdfDocument', pdfDocumentSchema)
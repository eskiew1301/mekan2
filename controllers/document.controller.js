const HttpError = require("../models/http-errors");
const PdfDocument = require("../models/document.model");

const addFile = async (req, res, next) => {
    const title = req.body.title;
    const fileName = req.file.filename; // Use filename
    try {
        await PdfDocument.create({ title: title, document: fileName });
        res.send({ status: "ok" });
    } catch (error) {
        res.json({ status: error.message });  // Corrected 'statue' to 'status'
    }
};

const getFile = async (req, res, next) => {
    try {
        const documents = await PdfDocument.find({});  // Using await instead of then()
        res.send({ status: 'ok', data: documents });  // Sending data response once
    } catch (err) {
        const error = new HttpError(
            "Fetching document failed, please try again later.",
            500
        );
        return next(error);
    }
 
};


module.exports = { addFile, getFile };
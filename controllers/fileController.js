const {Files} = require("../models");
const path = require("path");

exports.uploadFiles = async (req, res) => {
    let responseObj = {};
    responseObj.code = 400;
    responseObj.message = "Something went wrong!";
    responseObj.data = null;

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded!" });
        }

        let filesData = req.files.map(file => ({
            name: file.filename,
            original_name: file.originalname,
            url: `${process.env.CURRENT_URL}/uploads/${file.filename}`,
            type: path.extname(file.originalname),
        }));

        console.log("filesData:: ", JSON.stringify(filesData));
        
        const uploadedImages = await Files.bulkCreate(filesData);
        console.log("uploadedImages:: ", uploadedImages);
        
        responseObj.code = 200;
        responseObj.message = "Files uploaded successfully !";
        responseObj.data = uploadedImages;

        return res.status(responseObj.code).json(responseObj);

    } catch (error) {
        responseObj.message = error.message;
        return res.status(responseObj.code).json(responseObj);
    }
};

exports.getAllFiles = async (req, res) => {
    let responseObj = {};
    responseObj.code = 400;
    responseObj.message = "Something went wrong!";
    responseObj.data = null;

    try {
        const files = await Files.findAll({
            order : [["id", "desc"]]
        });

        responseObj.code = 200;
        responseObj.message = "Categories fetched successfully !";
        responseObj.data = files;
        return res.status(responseObj.code).json(responseObj);
    } catch (error) {
        return res.status(responseObj.code).json(responseObj);
    }
};

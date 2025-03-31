const { SizeUnits } = require('../models');

exports.list = async (req, res) => {
    let responseObj = {};
    responseObj.code = 400;
    responseObj.message = "Something went wrong!";
    responseObj.data = null;

    try {
        const getSizeUnits = await SizeUnits.findAll();

        responseObj.code = 200;
        responseObj.message = "Size units fetched successfully!";
        responseObj.data = getSizeUnits;
        return res.status(responseObj.code).json(responseObj);

    } catch (error) {
        responseObj.message = error.message;
        return res.status(responseObj.code).json(responseObj);
    }
};

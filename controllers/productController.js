const { validationResult } = require('express-validator');
const crypto = require("crypto");
const {
    Products
} = require('../models');

function generateProductId(length) {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    return crypto.randomInt(min, max).toString();
}

exports.list = async (req, res) => {
    let responseObj = {
        code: 400,
        message: "Something went wrong!",
        data: null
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const { count, rows: products } = await Products.findAndCountAll({
            distinct: true,
            limit,
            offset,
            order: [['id', 'desc']],
        });

        const totalPages = Math.ceil(count / limit);

        responseObj.code = 200;
        responseObj.message = "Products fetched successfully!";
        responseObj.data = {
            products,
            pagination: {
                totalItems: count,
                currentPage: page,
                perPage: limit,
                totalPages,
                nextPage: page < totalPages,
                previousPage: page > 1
            }
        };

        return res.status(200).json(responseObj);
    } catch (error) {
        responseObj.message = error.message;
        return res.status(500).json(responseObj);
    }
};


exports.add = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let responseObj = {};
    responseObj.code = 400;
    responseObj.message = "Something went wrong!";
    responseObj.data = null;
    console.log("req body:: ", req.body);

    try {
        let productObj = { ...req.body };

        console.log("user:: ", req.user);

        const randomProductId = generateProductId(10);
        if (randomProductId) {
            productObj.product_id = randomProductId;
        }

        console.log("productObj:: ", JSON.stringify(productObj));

        const productCreated = await Products.create(productObj);

        if (!productCreated.id) {
            responseObj.code = 500;
            responseObj.message = "Record not inserted";
            return res.status(responseObj.code).json(responseObj);
        }

        responseObj.code = 200;
        responseObj.message = "Product created successfully !";
        responseObj.data = productCreated.toJSON();
        return res.status(responseObj.code).json(responseObj);

    } catch (error) {
        responseObj.message = error.message;
        return res.status(responseObj.code).json(responseObj);
    }

}

exports.get = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let responseObj = {};
    responseObj.code = 400;
    responseObj.message = "Something went wrong!";
    responseObj.data = null;

    try {
        const { id } = req.params;
        console.log("property id:: ", id);


        const property = await Products.findOne({
            where: { id }
        })



        responseObj.code = 200;
        responseObj.message = "Property fetched successfully !";
        responseObj.data = property
        return res.status(responseObj.code).json(responseObj);

    } catch (error) {
        responseObj.message = error.message;
        return res.status(responseObj.code).json(responseObj);
    }

}

exports.put = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let responseObj = {};
    responseObj.code = 400;
    responseObj.message = "Something went wrong!";
    responseObj.data = null;
    console.log("req body in update product:: ", JSON.stringify(req.body));

    try {
        const { id: productId } = req.params;

        // Check product exists or not
        let productExists = await Products.findByPk(productId);
        if (!productExists) {
            return res.status(404).json({ code: 404, message: "Product not found!" });
        }

        let { product_id } = req.body;

        if (product_id) {
            delete req.body.product_id;
        }

        let productObj = { ...req.body };

        console.log("productObj:: ", productObj);


        const [updatedRows] = await Products.update(productObj, { where: { id: productId } });
        console.log("updatedRows:: ", updatedRows);

        if (updatedRows === 0) {
            responseObj.code = 200;
            responseObj.message = "Record not updated";
            return res.status(responseObj.code).json(responseObj);
        }

        const updatedProduct = await Products.findByPk(productId);

        responseObj.code = 200;
        responseObj.message = "Product updated successfully !";
        responseObj.data = updatedProduct;
        return res.status(responseObj.code).json(responseObj);

    } catch (error) {
        console.log("Error in update product controller :: ", error);

        responseObj.message = error.message;
        return res.status(responseObj.code).json(responseObj);
    }

}

exports.delete = async (req, res) => {
    console.log(">> DELETE Request:", req.params.id);

    let responseObj = {
        code: 400,
        message: "Something went wrong!",
        data: null
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(">> Validation Errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        console.log(">> Deleting product with ID:", id);

        const product = await Products.findByPk(id);
        if (!product) {
            console.log(">> Product not found:", id);
            return res.status(404).json({ code: 404, message: "Product not found!" });
        }

        await Products.destroy({ where: { id } });

        console.log(">> Product deleted:", id);
        responseObj.code = 200;
        responseObj.message = "Product deleted successfully!";
        return res.status(responseObj.code).json(responseObj);

    } catch (error) {
        console.log(">> Error during deletion:", error);
        responseObj.message = error.message;
        return res.status(responseObj.code).json(responseObj);
    }
};


exports.checkSlugController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let responseObj = {};
    responseObj.code = 400;
    responseObj.message = "Something went wrong!";
    responseObj.data = null;
    console.log("req body:: ", JSON.stringify(req.body));

    try {
        const { slug } = req.body;

        const exists = await Properties.findOne({ where: { slug } });

        responseObj.code = 200;
        responseObj.message = "Slug is available";
        responseObj.data = { exists: !!exists };
        return res.status(responseObj.code).json(responseObj);
    } catch (error) {
        responseObj.message = error.message;
        return res.status(responseObj.code).json(responseObj);
    }
}

exports.getPropertyBySlug = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let responseObj = {};
    responseObj.code = 400;
    responseObj.message = "Something went wrong!";
    responseObj.data = null;

    try {
        const { slug } = req.params;
        console.log("property slug:: ", slug);


        const property = await Properties.findOne({
            where: { slug },
            include: [
                {
                    model: Types,
                    as: "property_type",
                    attributes: ['name']
                },
                {
                    model: Categories,
                    as: "property_category",
                    attributes: ['name']
                },
                {
                    model: Amenities,
                    as: "amenities",
                    through: { attributes: [] },
                    attributes: ["id", "name", "created_at"]
                },
                {
                    model: PropertyFloorPlans,
                    as: "floorPlans",
                    attributes: ["id", "floor_no", "floor_name", "bedroom", "bathroom", "image_url"],
                    order: [['id', 'asc']]
                },
                {
                    model: PropertyAddress,
                    as: 'propertyAddress',
                    attributes: ['address', 'city', 'state', 'postal_code', 'area', 'country']
                },
                {
                    model: Files,
                    as: "images",
                    through: { attributes: [] }
                }
            ],
            order: [[{ model: PropertyFloorPlans, as: "floorPlans" }, "id", "ASC"]]
        })



        responseObj.code = 200;
        responseObj.message = "Property fetched successfully !";
        responseObj.data = property
        return res.status(responseObj.code).json(responseObj);

    } catch (error) {
        responseObj.message = error.message;
        return res.status(responseObj.code).json(responseObj);
    }

}

exports.filterController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let responseObj = {};
    responseObj.code = 400;
    responseObj.message = "Something went wrong!";
    responseObj.data = null;

    try {
        const { filter } = req.body;
        console.log("property slug:: ", JSON.stringify(filter));


        const property = await Properties.findAll({
            where: { ...filter },
            include: [
                {
                    model: Types,
                    as: "property_type",
                    attributes: ['name']
                },
                {
                    model: Categories,
                    as: "property_category",
                    attributes: ['name']
                },
                {
                    model: Amenities,
                    as: "amenities",
                    through: { attributes: [] },
                    attributes: ["id", "name", "created_at"]
                },
                {
                    model: PropertyFloorPlans,
                    as: "floorPlans",
                    attributes: ["id", "floor_no", "floor_name", "bedroom", "bathroom", "image_url"],
                    order: [['id', 'asc']]
                },
                {
                    model: PropertyAddress,
                    as: 'propertyAddress',
                    attributes: ['address', 'city', 'state', 'postal_code', 'area', 'country']
                },
                {
                    model: Files,
                    as: "images",
                    through: { attributes: [] }
                }
            ],
            order: [[{ model: PropertyFloorPlans, as: "floorPlans" }, "id", "ASC"]]
        })



        responseObj.code = 200;
        responseObj.message = "Property fetched successfully !";
        responseObj.data = property
        return res.status(responseObj.code).json(responseObj);

    } catch (error) {
        responseObj.message = error.message;
        return res.status(responseObj.code).json(responseObj);
    }
}

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Roles } = require("../models");
require("dotenv").config();

exports.signup = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, roleId } = req.body;

    try {

        const userExist = await User.findOne({where: {email, roleId}, raw: true, nest: true});

        if(userExist){
            return res.status(409).json({ code: 409, message: "User already exist!", data: null });
        }

        const isRoleExist = await Roles.findByPk(roleId);

        if(!isRoleExist){
            return res.status(404).json({ code: 404, message: "Role not exist!", data: null });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, roleId });

        const createdUser = await User.findOne({
            where: {
                id: user.id
            },
            attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: Roles,
                    attributes: ["id", "name"],
                    as: 'userRole'
                },
            ],
            raw: true,
            nest: true
        })


        return res.status(201).json({ code: 201, message: "User registered successfully", data: createdUser });
    } catch (err) {
        console.log("err.message:: ", err.message);

        return res.status(500).json({ code: 500, message: err.message, data: null });
    }
};

exports.login = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, roleId } = req.body;
    
    try {
        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'username', 'email', 'password', 'createdAt'],
            include: [
                {
                    model: Roles,
                    where: {id: roleId},
                    attributes: ["id", "name"],
                    as: 'userRole'
                }
            ],
            raw: true,
            nest: true
        });

        console.log("user:: ", user);

        if (!user) return res.status(400).json({ message: "User not found" });

        console.log("password:: ", password, "user.password:: ", user.password);

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });
        const { userRole : { name: userRole }  } = user;
        console.log("user obj:: ", { id: user.id, email: user.email, roleId, role: userRole });
        
        const token = jwt.sign({ id: user.id, email: user.email, roleId, role: userRole }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.json({ token });
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: err.message });
    }
};

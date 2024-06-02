const User = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Chat = require('../model/chats')
const { Op } = require('sequelize');

function isStringInvalid(string) {
    return string === undefined || string.length === 0;
}

const signup = async (req, res, next) => {
    try {
        const { name, email, phonenumber, password } = req.body;

        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phonenumber) || isStringInvalid(password)) {
            return res.status(400).json({ error: "Bad parameters. Something is missing." });
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            const user = await User.findAll({ where: { email } });
            if (user.length > 0) {
                res.status(409).send({ 'message': 'User already exists, Please Login' });
            } else {
                const data = await User.create(
                    {
                        name: name, email: email, phonenumber: phonenumber, password: hash
                    });
                res.status(201).send({ 'message': 'User created successfully' });
            }
        })
    }
    catch (err) {
        console.log('err', err);
        res.status(500).send({ 'error': err, 'message': 'Something went wrong' });
    }
};

const generateAccessToken = (id, name) => {
    return jwt.sign({ userId: id, name: name }, process.env.TOKEN_SECRET);
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (isStringInvalid(email) || isStringInvalid(password)) {
        return res.status(400).json({ message: 'Email id or password missing', success: false })
    }

    try {
        const user = await User.findAll({ where: { email } });
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    res.status(500).send({ 'success': false, 'message': 'Something went wrong' });
                }
                if (result) {
                    res.status(200).send({ 'success': true, 'message': 'User logged in successfully!', 'token': generateAccessToken(user[0].id, user[0].name) });
                } else {
                    res.status(400).send({ 'success': false, 'message': 'Password is incorrect' });
                }
            })
        } else {
            res.status(404).send({ 'success': false, 'message': 'User does not exist' });
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({ 'success': false, 'message': 'something went wrong' });
    }
}

const saveChat = async (req, res, next) => {
    try{
        const { message } = req.body;
        const result = await Chat.create({ message, userId: req.user.id, username: req.user.name })
        console.log(result);
        res.status(201).json({result})
    } 
    catch(err){
        console.log(err);
        res.status(500).json({ message: err, success: false });
    }
}

const getUsers = async (req, res, next) => {
    try {
        const allUser = await User.findAll({ where: { id: { [Op.ne]: req.user.id } } })
        res.status(200).json(allUser);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

const getGroups = async (req, res, next) => {
    try {
        const groups = await req.user.getGroups();
        res.status(200).json({ "message": "success", groups });
    }
    catch (err) {
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

const getChats = async (req, res, next) => {
    try{

        const totalChats = await Chat.count();
        console.log("totalchats is: ", totalChats);
        let lastId = req.query.id;
        // console.log(req.query.id);
        if(lastId === undefined){
            lastId = -1;
        }
        console.log(lastId);
        const message = await Chat.findAll({where: { id: { [Op.gt]: lastId }}, attributes : ['id', 'message', 'username']})
        console.log("mess ", message);
        res.status(201).json(message)
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ error: "Internal server error." });
    }
}


module.exports = {
    signup,
    login, 
    saveChat,
    getUsers,
    getGroups,
    getChats
};
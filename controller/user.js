const User = require('../model/users');
const bcrypt = require('bcrypt');

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
                res.status(400).send({ 'message': 'User already exists' });
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
        res.status(400).send({ 'error': err, 'message': 'Something went wrong' });
    }
};

module.exports = {
    signup,
};
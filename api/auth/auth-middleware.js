const db = require('../../data/dbConfig');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets');

const usernameExists = async (req, res, next) => {
    try{
        const exists = await db('users')
        .where('username', req.body.username.trim())
        .first()

        if(exists) {
            next({ status: 401, message: 'username taken'})
        } else {
            next()
        }
    }
    catch (err) {
        next(err)
    }
}

const validateInput = async (req, res, next) => {
    try{
        const { username, password } = req.body;
        if(!username || !password) {
            next({ status: 400, message: 'username and password required'})
        } else {
            next()
        }
    }
    catch(err) {
        next(err)
    }
}

const buildToken = (user) => {
    const payload = {
        subject: user.id,
        username: user.username
    };
    const options = {
        expiresIn: '1d'
    }
    
    return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = {
    usernameExists,
    validateInput,
    buildToken
}
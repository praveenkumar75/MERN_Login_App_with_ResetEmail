const jwt =  require('jsonwebtoken')
const env = require('../config.js')

async function Auth(req, res, next){
    try {
        
        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, env.JWT_SECERT)

        req.user = decodedToken
        
        next()

    } catch (error) {
        res.status(401).json({ error : "Authentication Failed!"})
    }
}

function localVariable(req, res, next){
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}

module.exports = {Auth, localVariable}
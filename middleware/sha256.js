const jwt = require('jsonwebtoken');
const sha256 = require("crypto-js/sha256");
const controller = require('../controller/user.controller');
const crypto = require('crypto');

module.exports = function (req, res, next) {
    
    const decodedUser = req.decodedUser;
    const user = controller.findOne(decodedUser.id);
    
    crypto.publicDecrypt(key, hash);
    
    if (token === null) return res.json({ success: false, error: 'Failed to find token.' });
    try {
        if(jwt.verify(token, process.env.TOKEN_SECRET)){
            next();
        }
    } catch (err) {
        res.status(401).json({ success: false, error: 'Failed to authenticate token.' });
    }
}

function checkHash(data, hashItem){
    if(sha256(data) === hashItem){
        console.log('Hash valid');
        return true;
    }
    console.log('Hash invalid');
    return false;
}
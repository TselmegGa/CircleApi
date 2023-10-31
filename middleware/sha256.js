const jwt = require('jsonwebtoken');
const sha256 = require("crypto-js/sha256");
const crypto = require("crypto");
const controller = require('../controller/user.controller');
const rs = require('jsrsasign');

module.exports = async function (req, res, next) {
    
    const user = await controller.findOneCert(req.decodedUser.email);
    var sig = new rs.KJUR.crypto.Signature({alg: 'SHA1withRSA'});
    sig.init(user.certificate);
    let sigValueHex = req.body.hash;
    delete req.body.hash;
    sig.updateString(req.body.toString());
    var isValid = sig.verify(sigValueHex);

    try {
        if(isValid){
            next();
        }
        else{
            res.status(401).json({ success: false, error: 'Failed to authenticate user.' });
        }
    } catch (err) {
        res.status(401).json({ success: false, error: 'Failed to authenticate user.' });
    }
}
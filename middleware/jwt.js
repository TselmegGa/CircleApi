const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    
    const token = req.body.token || req.param('token') || req.headers['x-access-token'];
    
    if (token === null) return res.json({ success: false, error: 'Failed to find token.' });
    try {
        if(jwt.verify(token, process.env.TOKEN_SECRET)){
            next();
        }
    } catch (err) {
        res.status(401).json({ success: false, error: 'Failed to authenticate token.' });
    }
}

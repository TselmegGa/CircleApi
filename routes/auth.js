var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var controller = require('../controller/user.controller');

router.post('/register', (req, res) => {
  
  controller.create(req, res);
});

router.post('/login', (req, res) => {  
  controller.findOneByEmail(req, res);
});
module.exports = router;
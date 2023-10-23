const express = require('express');
const router = express.Router();
const controller = require('../controller/user.controller');

router.post('/register', (req, res) => {
  controller.create(req, res);
});

router.post('/login', (req, res) => {  
  controller.findOneByEmail(req, res);
});
module.exports = router;
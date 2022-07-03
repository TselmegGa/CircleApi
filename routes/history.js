const express = require('express');
const router = express.Router();
const controller = require('../controller/history.controller');

/* GET users listing. */
router.get('/', function(req, res, _next) {
  controller.findAll(req, res);
});



module.exports = router;

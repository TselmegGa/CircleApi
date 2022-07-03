var express = require('express');
var router = express.Router();
var controller = require('../controller/history.controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  controller.findAll(req, res);
});



module.exports = router;

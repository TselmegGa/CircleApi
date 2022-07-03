var express = require('express');
var router = express.Router();
var controller = require('../controller/user.controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  controller.findAll(req, res);
});
router.get('/:id', function(req, res, next) {
  controller.findOne(req, res);
});
router.put('/:id', function(req, res, next) {
  controller.update(req, res);
});



module.exports = router;

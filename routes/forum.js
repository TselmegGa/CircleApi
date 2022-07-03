var express = require('express');
var router = express.Router();
var controller = require('../controller/forum.controller');

router.post('/', function(req, res, next) {
  controller.create(req, res);
});
router.put('/:id', function(req, res, next) {
  controller.update(req, res);
});




module.exports = router;

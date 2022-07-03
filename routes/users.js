const express = require('express');
const router = express.Router();
const controller = require('../controller/user.controller');

/* GET users listing. */
router.get('/', function(req, res, _next) {
  controller.findAll(req, res);
});
router.get('/:id', function(req, res, _next) {
  controller.findOne(req, res);
});
router.put('/:id', function(req, res, _next) {
  controller.update(req, res);
});



module.exports = router;

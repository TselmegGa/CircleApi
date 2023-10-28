const express = require('express');
const router = express.Router();
const controller = require('../controller/forum.controller');

router.post('/', function(req, res, _next) {
  controller.create(req, res);
});
router.put('/:id', function(req, res, _next) {
  controller.update(req, res);
});

module.exports = router;

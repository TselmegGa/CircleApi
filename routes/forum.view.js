var express = require('express');
var router = express.Router();
var forumController = require('../controller/forum.controller');
var postController = require('../controller/post.controller');

/* GET users listing. */
router.get('/forum', function(req, res, next) {
  forumController.findAll(req, res);
});
router.get('/forum/:id', function(req, res, next) {
  forumController.findOne(req, res);
});
router.get('/post', function(req, res, next) {
  postController.findAll(req, res);
});
router.get('/post/:id', function(req, res, next) {
  postController.findOne(req, res);
});




module.exports = router;

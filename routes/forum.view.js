const express = require('express');
const router = express.Router();
const forumController = require('../controller/forum.controller');
const postController = require('../controller/post.controller');

/* GET users listing. */
router.get('/forum', function(req, res, _next) {
  forumController.findAll(req, res);
});
router.get('/forum/:id', function(req, res, _next) {
  forumController.findOne(req, res);
});
router.get('/post', function(req, res, _next) {
  postController.findAll(req, res);
});
router.get('/post/:id', function(req, res, _next) {
  postController.findOne(req, res);
});




module.exports = router;

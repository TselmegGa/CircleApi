const db = require("../model/sequelize");
const Post = db.post;
const User = db.user;
const historyController = require("./history.controller");
const SHA256 = require("crypto-js/sha256")
// Create and Save a new Post
exports.create = (req, res) => {

  const token = req.body.token || req.param('token') || req.headers['x-access-token'];
  const id = db.parseJwt(token).id;
    if (!req.body.details) {
      res.status(400).json({
        success: false,
        error: "details can not be empty!"
      });
      return;
    }
    // Create a Post
    const post = {
      UserId: id,
      ForumId: req.body.ForumId,
      details: req.body.details,
      date: Date.now(),
    };
    // Save Post in the database
    Post.create(post)
    .then(data => {
      historyController.create(id,"Post Created")
      res.json({
      success: true,
      model: data,
      hash: SHA256(data).toString()
      });
    })
    .catch(err => {
      res.status(500).json({
      success: false,
      error: "Failed to create Post!"+ err
      });
    });
    
};


// Retrieve all Post from the database.
exports.findAll = (_req, res) => {
Post.findAll({ include: User })
  .then(data => {
    res.json({
      success: true,
      model: data,
      hash: SHA256(data).toString()
    });
  })
  .catch(_err => {
    res.status(500).json({
      success: false,
      error: "Error trying to get all Post" 
    });
  });
};

// Find a single Post with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Post.findOne({ where:{id: id}, include: User })
      .then(data => {
        if (data) {
              res.json({
                success: true,
                model: data,
                hash: SHA256(data).toString()
          })
          
          
        } else {
          res.status(404).json({
            success: false,
            error: "Cannot find Post with id="+ id
          });
        }
      })
      .catch(_err => {
        res.status(500).json({
          success: false,
          error: "Error trying to get Post with id="+ id
        });
      });
};

// Update a Post by the id in the request
exports.update = (req, res) => {
  const token = req.body.token || req.param('token') || req.headers['x-access-token'];
  const id = db.parseJwt(token).id;
  Post.update(req.body, {
    where: { id: req.params.id, UserId: id }
  })
    .then(num => {
      if (num == 1) {
        historyController.create(id,"Post Updated")
        res.json({
          success: true,
          message: "Post was updated successfully.",
          hash: SHA256("Post was updated successfully.").toString()
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Error while updating to get Post" 
        });
      }
    })
    .catch(_err => {
      res.status(500).json({
        success: false,
        error: "Error trying to update Post" 
      });
    });
          
};

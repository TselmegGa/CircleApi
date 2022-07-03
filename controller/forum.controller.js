const db = require("../model/sequelize");
const Forum = db.forum;
const User = db.user;
const Post = db.post;
const historyController = require("./history.controller");
const SHA256 = require("crypto-js/sha256")
// Create and Save a new Forum
exports.create = (req, res) => {

  const token = req.body.token || req.param('token') || req.headers['x-access-token'];
  const id = db.parseJwt(token).id;
    if (!req.body.name) {
      res.status(400).json({
        success: false,
        error: "name can not be empty!"
      });
      return;
    }
    if (!req.body.details) {
      res.status(400).json({
        success: false,
        error: "details can not be empty!"
      });
      return;
    }
    // Create a Forum
    const forum = {
      UserId: id,
      name: req.body.name,
      details: req.body.details,
      date: Date.now(),
    };
    // Save Forum in the database
    Forum.create(forum)
    .then(data => {
      historyController.create(id,"Forum Created")
      res.json({
      success: true,
      model: data,
      hash: SHA256(data).toString()
      });
    })
    .catch(err => {
      res.status(500).json({
      success: false,
      error: "Failed to create Forum!"+ err
      });
    });
    
};


// Retrieve all Forum from the database.
exports.findAll = (_req, res) => {
Forum.findAll({ include: User })
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
      error: "Error trying to get all Forum" 
    });
  });
};

// Find a single Forum with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    
    Forum.findOne({ where:{id: id}, include: [
      {
        model: User,
        required: true
      },
      {
        model: Post,
        include:[User]
      },
    ] })
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
            error: "Cannot find Forum with id="+ id
          });
        }
      })
      .catch(_err => {
        res.status(500).json({
          success: false,
          error: "Error trying to get Forum with id="+ id
        });
      });
};

// Update a Forum by the id in the request
exports.update = (req, res) => {
  const token = req.body.token || req.param('token') || req.headers['x-access-token'];
  const id = db.parseJwt(token).id;
  Forum.update(req.body, {
    where: { id: req.params.id, UserId: id }
  })
    .then(num => {

      if (num == 1) {
        historyController.create(id,"Forum Updated")
        res.json({
          success: true,
          message: "Forum was updated successfully.",
          hash: SHA256("Forum was updated successfully.").toString()
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Error while updating to get Forum" 
        });
      }
    })
    .catch(_err => {
      res.status(500).json({
        success: false,
        error: "Error trying to update Forum" 
      });
    });
          
};

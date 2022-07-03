const db = require("../model/sequelize");
const History = db.user_history;

// Create and Save a new History
exports.create = (id, action) => {
    History.create({
      UserId: id,
      action: action,
      date: Date.now(),
    })
    .catch(err => {
      res.status(500).json({
      success: false,
      error: "Failed to create History!"+ err
      });
    });
};


// Retrieve all History from the database.
exports.findAll = (req, res) => {
History.findAll()
  .then(data => {
    res.json({
      success: true,
      model: data 
    });
  })
  .catch(err => {
    res.status(500).json({
      success: false,
      error: "Error trying to get all History" 
    });
  });
};
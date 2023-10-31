const db = require("../model/sequelize");
const User = db.user;
const historyController = require("./history.controller");
const keyGen = require("../certificate/key.gen");
const certificateGen = require("../certificate/cert");
const jwt = require('jsonwebtoken');
const SHA256 = require("crypto-js/sha256");


// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).json({
          success: false,
          error: "Name can not be empty!"
        });
        return;
      }
      if (!req.body.email) {
        res.status(400).json({
          success: false,
          error: "Email can not be empty!"
        });
        return;
      }
      if (!req.body.password) {
        res.status(400).json({
          success: false,
          error: "Password can not be empty!"
        });
        return;
      }
        create(req, res);
};

function create(req, res){
        // Create a User
        const keys = keyGen.generatePublicPrivatePairOfKeys();
        const csr = certificateGen.generateCSR(keys.privateKey, keys.publicKey);
        const cert = certificateGen.generateCertificate(csr);
        console.log(cert);
        console.log(keys.privateKey);
        const user = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          certificate: cert
        };
        
        // Save User in the database
        User.create(user)
          .then(data => {
            historyController.create(data.id,"User Created");
            res.json({
              success: true,
              model: {
                id: data.id,
                name: data.name,
                email: data.email,
                privKey: keys.privateKey
              },
              hash: SHA256({
                id: data.id,
                name: data.name,
                email: data.email,
                privKey: keys.privateKey
              }).toString(),
              jwt: jwt.sign({email: data.email, id: data.id}, process.env.TOKEN_SECRET, { expiresIn: '18000s' })
            });
          })
          .catch(err => {
            res.status(500).json({
              success: false,
              error: "Failed to create user"+ err
            });
          });
}

// Retrieve all User from the database.
exports.findAll = (_req, res) => {
  User.findAll({ 
    attributes: ['id','name', 'email', 'certificate']
}).then(data => {
      res.json({
        success: true,
        model: data,
        hash: SHA256(data).toString()    
      });
    })
    .catch(_err => {
      res.status(500).json({
        success: false,
        error: "Error trying to get all user" 
      });
    });
};
exports.findOneCert = (email) => {
  return User.findOne({ where: { email: email}, 
    attributes: ['certificate']
  })
}
// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    
    User.findByPk(id)
      .then(user => {
        if (user) {
          User.findOne({ where: { email: user.email}, 
            attributes: ['id','name', 'email', 'certificate']
          }).then(data => {
            if (data) {
              res.json({
                success: true,
                model: {
                  id: data.id,
                  name: data.name,
                  email: data.email,
                  certificate: data.certificate
                },
                hash: SHA256({
                  id: data.id,
                  name: data.name,
                  email: data.email,
                  certificate: data.certificate
                }).toString()
              });
              
            } else {
              res.status(404).json({
                success: false,
                error: "Cannot find user"
              });
            }
          })
          .catch(_err => {
            res.status(500).json({
              success: false,
              error: "Error trying to get user"
            });
          });
        } else {
          res.status(404).json({
            success: false,
            error: "Cannot find user with id="+ id
          });
        }
      })
      .catch(_err => {
        res.status(500).json({
          success: false,
          error: "Error trying to get user with id="+ id
        });
      });
};
exports.findOneByEmail = (req, res) => {
  User.findOne({ where: { email: req.body.email, password: req.body.password },
    attributes: ['id','name', 'email', 'certificate']
  }).then(data => {
      if (data) {
        res.json({
          success: true,
          model: {
            id: data.id,
            name: data.name,
            email: data.email,
            certificate: data.certificate
          },
          hash: SHA256({
            id: data.id,
            name: data.name,
            email: data.email,
            certificate: data.certificate
          }).toString(),
          jwt: jwt.sign({email: data.email, id: data.id}, process.env.TOKEN_SECRET, { expiresIn: '1800s' })
        });
        
      } else {
        res.status(404).json({
          success: false,
          error: "Cannot find user"
        });
      }
    })
    .catch(_err => {
      res.status(500).json({
        success: false,
        error: "Error trying to get user while logging"
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  const token = req.body.token || req.param('token') || req.headers['x-access-token'];
  const email = db.parseJwt(token).email;
  User.findByPk(id)
      .then(data => {
        if(data.email === email){
              update(req, res)
        } else {
          res.status(500).json({
                success: false,
                error: "Error while updating to get User" 
              });
            }
          })

};
function update(req, res){
  const token = req.body.token || req.param('token') || req.headers['x-access-token'];
  const id = db.parseJwt(token).id;
  if (id != req.params.id) {
    res.status(400).json({
      success: false,
      error: "You dont have permission"
    });
    return;
  }

  User.update(req.body, {
    where: { id: req.params.id }
  })
    .then(num => {
      historyController.create(req.param.id,"Update User Information")
      if (num == 1) {
        res.json({
          success: true,
          message: "User was updated successfully.",
          hash: SHA256("User was updated successfully.").toString()
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Error while updating to get user" 
        });
      }
    })
    .catch(_err => {
      res.status(500).json({
        success: false,
        error: "Error trying to update user" 
      });
    });
}

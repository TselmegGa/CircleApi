const Sequelize = require("sequelize-cockroachdb");

// Option 2: Passing parameters separately (other dialects)
//sequelize
const sequelize = new Sequelize("postgresql://tselmeg:00Xmsg0ul85AbrSJDcOK5A@free-tier13.aws-eu-central-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dquiet-primate-2166");


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.parseJwt = function(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(Buffer.from(base64, 'base64').toString());
}
db.forum = require("./forum")(sequelize, Sequelize);
db.user = require("./user")(sequelize, Sequelize);
db.post = require("./post")(sequelize, Sequelize);
db.user_history = require("./user.history")(sequelize, Sequelize);

db.forum.hasMany(db.post);
db.post.belongsTo(db.forum);
db.user.hasMany(db.post);
db.post.belongsTo(db.user);
db.user.hasMany(db.forum);
db.forum.belongsTo(db.user);
db.user.hasMany(db.user_history);
db.user_history.belongsTo(db.user);



module.exports = db;
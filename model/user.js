module.exports = (sequelize, Sequelize) => {
  return sequelize.define("User", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  certificate: {
    type: Sequelize.TEXT,
    allowNull: false
  }
},{freezeTableName: true});
};

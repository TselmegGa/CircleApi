module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
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
  privKey: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  pubKey: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  certificate: {
    type: Sequelize.TEXT,
    allowNull: false
  },
});
return User;
}

module.exports = (sequelize, Sequelize) => {
  return sequelize.define("UserHistory", {
  action: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },

});
 }

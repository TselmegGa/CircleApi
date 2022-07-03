module.exports = (sequelize, Sequelize) => {
  const UserHistory = sequelize.define("UserHistory", {
  action: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },

});
return UserHistory;
 }

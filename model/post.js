module.exports = (sequelize, Sequelize) => {
  return sequelize.define("Post", {
  details: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },

});
 
}
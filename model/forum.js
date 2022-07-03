module.exports = (sequelize, Sequelize) => {
  const Forum = sequelize.define("Forum", { 
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  details: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },

});
return Forum;
}
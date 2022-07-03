module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("Post", {
  details: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },

});
return Post;
}
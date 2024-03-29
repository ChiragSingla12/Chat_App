const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('chat-app', 'root', 'Yash@2005', {
    dialect: 'mysql',
    host: 'localhost',
    logging: false
});

module.exports = sequelize;
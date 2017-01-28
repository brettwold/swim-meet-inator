class Sequelize {
    constructor() {
        const Sequelize = require('sequelize');
        const env = process.env.NODE_ENV || 'development';
        const config = require('./db.config.js')[env];

        return new Sequelize(config.database, config.username, config.password, config);
    }
}

module.exports = new Sequelize();

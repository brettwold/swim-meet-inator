const fs = require('fs');
const path = require('path');
const Sequelize = require('../common/sequelize');

let models = [];

let dir = fs.readdirSync(__dirname).filter((file) => {
    return file !== 'index.js' && !file.endsWith('.map');
});

for (let file of dir) {
    let model = Sequelize['import'](path.join(__dirname, file));
    models[model.name] = model;
}

for (let name in models) {
    if (models[name].associate) {
        models[name].associate(models);
    }
}

Sequelize.sync()
  .then(function(err) {
    console.log('Database synchronised');
  }, function (err) {
    console.log('An error occurred while creating the table', err);
  });

module.exports = models;

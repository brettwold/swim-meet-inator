"use strict";
var JsonField = require('sequelize-json');

module.exports = function(sequelize, DataTypes) {
  var Entry = sequelize.define("Entry", {
    entry_date: DataTypes.DATE,
    entries: JsonField(sequelize, 'Entry', 'entries'),
    special_notes: DataTypes.TEXT,
    cost_per_race: DataTypes.INTEGER,
    admin_fee: DataTypes.INTEGER,
    total_cost: DataTypes.INTEGER,
    paid: DataTypes.BOOLEAN,
    paid_date: DataTypes.DATE,
    payment_method: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Entry.belongsTo(models.Swimmer, {as: 'swimmer'});
        Entry.belongsTo(models.Meet, {as: 'meet'});
      }
    },
    getterMethods: {
    },
    setterMethods: {
    }
  });

  return Entry;
};

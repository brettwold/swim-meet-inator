"use strict";

module.exports = function(sequelize, DataTypes) {
  var Entry = sequelize.define("Entry", {
    race_types: DataTypes.STRING,
    special_notes: DataTypes.TEXT,
    cost_per_race: DataTypes.INTEGER,
    admin_fee: DataTypes.INTEGER,
    payment_total: DataTypes.INTEGER,
    paid: DataTypes.BOOLEAN,
    paid_date: DataTypes.DATE,
    payment_method: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Entry.belongsTo(models.Swimmer, {as: 'swimmer'});
        Entry.belongsTo(models.Meet, {as: 'meet'});
        Entry.belongsToMany(models.SwimTime, { through: 'entrytime', as: 'entrytimes' });
      }
    },
    getterMethods: {
      race_types_arr: function() {
        return this.getDataValue('race_types') ? this.getDataValue('race_types').split(',') : null;
      }
    },
    setterMethods: {
      race_types_arr: function(arr) {
        return this.setDataValue('race_types', arr !== null ? arr.join() : null);
      }
    }
  });

  return Entry;
};

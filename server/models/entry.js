"use strict";

module.exports = function(sequelize, DataTypes) {
  var Entry = sequelize.define("Entry", {
    race_types: DataTypes.STRING,
    special_notes: DataTypes.TEXT,
    paid: DataTypes.BOOLEAN,
    payment_method: DataTypes.STRING
  }, {
    classMethods: {
    	associate: function(models) {
        Entry.belongsTo(models.Swimmer);
        Entry.belongsTo(models.Meet);
        Entry.belongsToMany(models.SwimTime, {as: 'EntryTimes', through: 'entry_times'});
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

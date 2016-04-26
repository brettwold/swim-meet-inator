"use strict";

module.exports = function(sequelize, DataTypes) {
  var Entry = sequelize.define("Entry", {
    events: DataTypes.STRING,
    entry_times: DataTypes.STRING,
    special_notes: DataTypes.TEXT,
    paid: DataTypes.BOOLEAN,
    payment_method: DataTypes.STRING
  }, {
    classMethods: {
    	associate: function(models) {
        Entry.belongsTo(models.Swimmer);
        Entry.belongsToMany(models.SwimTime, {through: 'EntryTimes'});
    	}
    }
  });

  return Entry;
};

"use strict";

var TimeUtils = require('../helpers/timeutils');

module.exports = function(sequelize, DataTypes) {
  var SwimTime = sequelize.define("SwimTime", {
    source:	DataTypes.CHAR(3),
    race_type: { type: DataTypes.INTEGER, unique: 'swimtimeUnique' },
    date: { type: DataTypes.DATEONLY, unique: 'swimtimeUnique' },
    time: { type: DataTypes.INTEGER, unique: 'swimtimeUnique' },
    time_orig: DataTypes.STRING,
    fina_points: DataTypes.INTEGER,
    round: DataTypes.CHAR(1),
    meet_name: DataTypes.STRING,
    venue: DataTypes.STRING,
    license: DataTypes.STRING,
    level: DataTypes.INTEGER
  }, {
    classMethods: {
    	associate: function(models) {
        SwimTime.belongsTo(models.Swimmer);
        SwimTime.belongsToMany(models.Entry, { as:'entry_times', through: 'EntryTimes'} );
    	}
    },
    getterMethods: {
      time_formatted  : function() {
        return TimeUtils.getStringFromHundredths(this.getDataValue('time'));
      }
    },
    setterMethods: {
      time_formatted  : function(timeStr) {
        this.setDataValue('time_orig', timeStr);
        var tenths = TimeUtils.getHundredthsFromString(timeStr);
        this.setDataValue('time', tenths);
      }
    }
  });

  return SwimTime;
};

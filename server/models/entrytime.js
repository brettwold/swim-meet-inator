"use strict";

var TimeUtils = require('../helpers/timeutils');

module.exports = function(sequelize, DataTypes) {
  var EntryTime = sequelize.define("EntryTime", {
    course_type: { type: DataTypes.CHAR(2), unique: 'entrytimeUnique' },
    distance: { type: DataTypes.INTEGER, unique: 'entrytimeUnique' },
    stroke: { type: DataTypes.CHAR(2), unique: 'entrytimeUnique' },
    time: { type: DataTypes.INTEGER, unique: 'entrytimeUnique' },
    gender: { type: DataTypes.CHAR(1), unique: 'entrytimeUnique' },
    group: { type: DataTypes.CHAR(2), unique: 'entrytimeUnique' }
  }, {
    classMethods: {
      associate: function(models) {
        EntryTime.belongsTo(models.Timesheet);
      }
    },
    getterMethods: {
      time_formatted  : function() {
        return TimeUtils.getStringFromHundredths(this.getDataValue('time'));
      }
    },
    setterMethods: {
      time_formatted  : function(timeStr) {
        this.setDataValue('time', TimeUtils.getHundredthsFromString(timeStr));
      }
    }
  });

  return EntryTime;
};

"use strict";

var TimeUtils = require('../helpers/timeutils');

module.exports = function(sequelize, DataTypes) {
  var TimesheetEntrytime = sequelize.define("TimesheetEntrytime", {
    time: { type: DataTypes.INTEGER, unique: 'timesheetEntrytimeUnique' },
    entry_group: { type: DataTypes.CHAR(2), unique: 'timesheetEntrytimeUnique' }
  }, {
    classMethods: {
      associate: function(models) {
        TimesheetEntrytime.belongsTo(models.TimesheetEntry);
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

  return TimesheetEntrytime;
};

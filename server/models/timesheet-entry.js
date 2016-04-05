"use strict";

var TimeUtils = require('../helpers/timeutils');

module.exports = function(sequelize, DataTypes) {
  var TimesheetEntry = sequelize.define("TimesheetEntry", {
    distance: { type: DataTypes.INTEGER, unique: 'entrytimeUnique' },
    stroke: { type: DataTypes.CHAR(2), unique: 'entrytimeUnique' },
    gender: { type: DataTypes.CHAR(1), unique: 'entrytimeUnique' },
  }, {
    classMethods: {
      associate: function(models) {
        TimesheetEntry.belongsTo(models.Timesheet);
        TimesheetEntry.hasMany(models.TimesheetEntrytime)
      }
    }
  });

  return TimesheetEntry;
};

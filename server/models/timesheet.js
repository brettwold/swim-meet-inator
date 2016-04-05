"use strict";

var TimeUtils = require('../helpers/timeutils');

module.exports = function(sequelize, DataTypes) {
  var Timesheet = sequelize.define("Timesheet", {
    level: DataTypes.INTEGER,
    name:	DataTypes.STRING,
    course_type: DataTypes.CHAR(2),
    genders: DataTypes.STRING,
    entry_groups: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Timesheet.hasMany(models.TimesheetEntrytime);
      }
    }
  });

  return Timesheet;
};

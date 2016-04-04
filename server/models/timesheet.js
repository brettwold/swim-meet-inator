"use strict";

var TimeUtils = require('../helpers/timeutils');

module.exports = function(sequelize, DataTypes) {
  var Timesheet = sequelize.define("Timesheet", {
    level: DataTypes.INTEGER,
    name:	DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Timesheet.hasMany(models.EntryTime);
      }
    }
  });

  return Timesheet;
};

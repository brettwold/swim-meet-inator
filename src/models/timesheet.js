"use strict";

var TimeUtils = require('../helpers/timeutils');
var JsonField = require('sequelize-json');

module.exports = function(sequelize, DataTypes) {
  var Timesheet = sequelize.define("Timesheet", {
    level: DataTypes.INTEGER,
    name:	DataTypes.STRING,
    course_type: DataTypes.CHAR(2),
    genders: JsonField(sequelize, 'Timesheet', 'genders'),
    race_types: JsonField(sequelize, 'Timesheet', 'race_types'),
    entry_groups: JsonField(sequelize, 'Timesheet', 'entry_groups'),
    sheet: JsonField(sequelize, 'Timesheet', 'sheet')
  }, {

  });

  return Timesheet;
};

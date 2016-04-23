"use strict";

var TimeUtils = require('../helpers/timeutils');

module.exports = function(sequelize, DataTypes) {
  var Timesheet = sequelize.define("Timesheet", {
    level: DataTypes.INTEGER,
    name:	DataTypes.STRING,
    course_type: DataTypes.CHAR(2),
    genders: DataTypes.STRING,
    race_types: DataTypes.STRING,
    entry_groups: DataTypes.STRING,
    timesheet_data: {
      type: DataTypes.TEXT,
      allowNull: true,
    }

  }, {
    classMethods: {

    },
    getterMethods: {
      genders_arr: function() {
        return this.getDataValue('genders') !== null ? this.getDataValue('genders').split(',') : null;
      },
      entry_groups_arr: function() {
        return this.getDataValue('entry_groups') !== null ? this.getDataValue('entry_groups').split(',') : null;
      },
      race_types_arr: function() {
        return this.getDataValue('race_types') !== null ? this.getDataValue('race_types').split(',') : null;
      },
      sheet: function() {
        return this.getDataValue('timesheet_data') !== null ? JSON.parse(this.getDataValue('timesheet_data')) : null;
      }
    },
    setterMethods: {
      genders_arr: function(arr) {
        return this.setDataValue('genders', arr.join());
      },
      entry_groups_arr: function(arr) {
        return this.setDataValue('entry_groups', arr.join());
      },
      race_types_arr: function(arr) {
        return this.setDataValue('race_types', arr.join());
      },
      sheet: function(d) {
        return this.setDataValue('timesheet_data', JSON.stringify(d));
      }
    },
  });

  return Timesheet;
};

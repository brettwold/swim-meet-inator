"use strict";
var moment = require('moment');
var path = require('path');
var slugify = require('slugify')
var JsonField = require('sequelize-json');

module.exports = function(sequelize, DataTypes) {
  var Meet = sequelize.define("Meet", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
  	name: DataTypes.STRING,
  	title: DataTypes.STRING,
  	meet_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
  	qual_date: DataTypes.DATEONLY,
    venue: DataTypes.STRING,
    course_type: DataTypes.CHAR(2),
    lanes: DataTypes.INTEGER,
    meet_type: DataTypes.STRING,
    age_type: DataTypes.CHAR(3),
    genders: JsonField(sequelize, 'Meet', 'genders'),
    entry_groups: JsonField(sequelize, 'Meet', 'entry_groups'),
    race_types: JsonField(sequelize, 'Meet', 'race_types'),
    cost_per_race: { type: DataTypes.INTEGER, defaultValue: 0 },
    admin_fee: { type: DataTypes.INTEGER, defaultValue: 0 },
    promoter: DataTypes.STRING,
  	final_lanes: DataTypes.INTEGER,
  	hdw: { type: DataTypes.BOOLEAN, defaultValue: true },
  	program_notes: DataTypes.BOOLEAN,
  	announcer: DataTypes.STRING,
  	junior: { type: DataTypes.BOOLEAN, defaultValue: false },
  	club_scores: DataTypes.STRING,
  	one_card: { type: DataTypes.BOOLEAN, defaultValue: false },
  	all_heats: { type: DataTypes.BOOLEAN, defaultValue: true },
  	next_competitor_number: DataTypes.INTEGER,
  	meet_specific: { type: DataTypes.BOOLEAN, defaultValue: false },
  	multi_session: { type: DataTypes.BOOLEAN, defaultValue: false },
    num_sessions: { type: DataTypes.INTEGER, defaultValue: 0 },
  	print_times: { type: DataTypes.BOOLEAN, defaultValue: false },
  	split_last_heats: { type: DataTypes.BOOLEAN, defaultValue: false },
  	gala_directory: DataTypes.STRING,
  	work_directory: DataTypes.STRING,
  	notes: DataTypes.STRING,
    is_open: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_complete: { type: DataTypes.BOOLEAN, defaultValue: false },
    entry_events: JsonField(sequelize, 'Meet', 'entry_events')
    }, {
      classMethods: {
        associate: function(models) {
          Meet.hasMany(models.Event);
          Meet.hasMany(models.Entry);
          Meet.belongsTo(models.Timesheet, {as: 'minimum_timesheet'});
          Meet.belongsTo(models.Timesheet, {as: 'maximum_timesheet'});
          Meet.belongsTo(models.Timesheet, {as: 'auto_timesheet'});
        }
      },
      getterMethods: {
        results_dir: function() {
          var startDate = moment(this.getDataValue('meet_date'));
          var name = slugify(this.getDataValue('name')).toLowerCase();
          return path.join(startDate.format("YYYY"), startDate.format("MM"), startDate.format("DD"), name);
        }
      },
      setterMethods: {
      },
  }, {tableName: 'meets'});

  return Meet;
};

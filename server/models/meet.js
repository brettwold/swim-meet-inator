"use strict";

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
    genders: DataTypes.STRING,
    entry_groups: DataTypes.STRING,
    race_types: DataTypes.STRING,
    cost_per_race: DataTypes.INTEGER,
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
  	multi_session: { type: DataTypes.BOOLEAN, defaultValue: true },
  	print_times: { type: DataTypes.BOOLEAN, defaultValue: false },
  	split_last_heats: { type: DataTypes.BOOLEAN, defaultValue: false },
  	www_directory: DataTypes.STRING,
  	www_style: DataTypes.STRING,
  	www_class: DataTypes.STRING,
  	www_header: DataTypes.STRING,
  	www_footer: DataTypes.STRING,
  	gala_directory: DataTypes.STRING,
  	work_directory: DataTypes.STRING,
  	notes: DataTypes.STRING,
    is_open: DataTypes.BOOLEAN,
    entry_events_data: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
          Meet.hasMany(models.Event);
          Meet.hasMany(models.Entry);
          Meet.belongsTo(models.Timesheet, {as: 'minimum_timesheet'});
          Meet.belongsTo(models.Timesheet, {as: 'maximum_timesheet'});
        }
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
        entry_events: function() {
          return this.getDataValue('entry_events_data') !== null ? JSON.parse(this.getDataValue('entry_events_data')) : null;
        }
      },
      setterMethods: {
        genders_arr: function(arr) {
          return this.setDataValue('genders', arr !== null ? arr.join() : null);
        },
        entry_groups_arr: function(arr) {
          return this.setDataValue('entry_groups', arr !== null ? arr.join() : null);
        },
        race_types_arr: function(arr) {
          return this.setDataValue('race_types', arr !== null ? arr.join() : null);
        },
        entry_events: function(d) {
          return this.setDataValue('entry_events_data', JSON.stringify(d));
        }
      },
  }, {tableName: 'meets'});

  return Meet;
};

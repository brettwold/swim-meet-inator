"use strict";

module.exports = function(sequelize, DataTypes) {
  var Meet = sequelize.define("meet", {
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
  	age_groups: DataTypes.STRING,
    genders: DataTypes.STRING,
    age_type: DataTypes.CHAR(3),
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
  	notes: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
          Meet.hasMany(models.event)
        }
      }
  }, {tableName: 'meets'});

  return Meet;
};

"use strict";

module.exports = function(sequelize, DataTypes) {
  var Meet = sequelize.define("meet", {
  	name: DataTypes.STRING,
  	title: DataTypes.STRING,
  	meet_date: DataTypes.DATE,
  	qual_date: DataTypes.DATE,
    venue: DataTypes.STRING,
  	age_groups: DataTypes.BOOLEAN,
  	meet_type: DataTypes.STRING,
  	promoter: DataTypes.STRING,
  	lanes: DataTypes.INTEGER,
  	final_lanes: DataTypes.INTEGER,
  	hdw: DataTypes.BOOLEAN,
  	program_notes: DataTypes.BOOLEAN,
  	aoe: DataTypes.BOOLEAN,
  	aoe_online: DataTypes.STRING,
  	announcer: DataTypes.STRING,
  	junior: DataTypes.BOOLEAN,
  	club_scores: DataTypes.STRING,
  	one_card: DataTypes.BOOLEAN,
  	all_heats: DataTypes.BOOLEAN,
  	next_competitor_number: DataTypes.INTEGER,
  	meet_specific: DataTypes.BOOLEAN,
  	multi_session: DataTypes.BOOLEAN,
  	print_times: DataTypes.BOOLEAN,
  	split_last_heats: DataTypes.BOOLEAN,
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

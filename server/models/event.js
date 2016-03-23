"use strict";

module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define("event", {
    event_number: DataTypes.INTEGER,
  	event_type: DataTypes.CHAR(3),
  	event_sequence: DataTypes.INTEGER,
  	age_group: DataTypes.STRING,
  	genders: DataTypes.STRING,
  	distance: DataTypes.STRING,
  	stroke:	DataTypes.CHAR(2),
  	event_date:	DataTypes.DATEONLY,
  	limit_time:	DataTypes.INTEGER,
  	record_time: DataTypes.INTEGER,
  	qualifying_time: DataTypes.INTEGER,
  	maximum_entries: DataTypes.INTEGER,
  	final_event: DataTypes.STRING,
  	note:	DataTypes.STRING,
  	sponsor: DataTypes.STRING,
  	event_print_number: DataTypes.STRING,
  	event_print_group: DataTypes.STRING,
  	combine_with:	DataTypes.STRING,
  	meet_specific: DataTypes.STRING,
  	bcp_age: DataTypes.STRING,
    session_number: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Event.hasMany(models.swim);
        Event.belongsTo(models.meet);
      }
    }
  });

  return Event;
};

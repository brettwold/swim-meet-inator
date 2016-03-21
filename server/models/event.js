"use strict";

module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define("event", {
    meet_id: DataTypes.UUID
  }, {
    classMethods: {
      associate: function(models) {
        Event.hasMany(models.swim)
      }
    }
  });

  return Event;
};

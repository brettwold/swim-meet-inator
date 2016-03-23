"use strict";

module.exports = function(sequelize, DataTypes) {
  var Swimmer = sequelize.define("swimmer", {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    club: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.CHAR(1),
    card_printed:	DataTypes.BOOLEAN,
    address_line_1: DataTypes.STRING,
    address_line_2: DataTypes.STRING,
    town: DataTypes.STRING,
    county: DataTypes.STRING,
    post_code: DataTypes.STRING(10),
    telephone_no: DataTypes.STRING(17),
    email: DataTypes.STRING,
    alt_club: DataTypes.STRING,
    regno: DataTypes.STRING,
    special_notes: DataTypes.TEXT
  }, {
    classMethods: {
    	associate: function(models) {
        Swimmer.hasMany(models.swim);
    	}
    }
  });

  return Swimmer;
};

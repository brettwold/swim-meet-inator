"use strict";
// Maps to ARES lstconc.txt (swimmers file)
// fields are:
//    id;bib;lastname;firstname;birthyear;abNat;abCat

var Utils = require('../helpers/utils');

module.exports = function(sequelize, DataTypes) {
  var Swimmer = sequelize.define("Swimmer", {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    club: DataTypes.INTEGER,
    dob: DataTypes.DATEONLY,
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
        Swimmer.hasMany(models.Swim);
        Swimmer.hasMany(models.SwimTime);
        Swimmer.belongsTo(models.Club);
    	}
    },
    getterMethods: {
      fullName: function() {
        return this.getDataValue('first_name') + ' ' + this.getDataValue('last_name');
      }
    },
    setterMethods: {
      fromData: function(data) {
        var fields = data.split(';');
        var fieldCount = 0;
        this.setDataValue('id', parseInt(fields[fieldCount++]));
        fieldCount++;
        //this.setDataValue('bib', fields[fieldCount++]);
        this.setDataValue('last_name', Utils.trimQuotes(fields[fieldCount++]));
        this.setDataValue('first_name',Utils.trimQuotes(fields[fieldCount++]));
        this.setDataValue('dob', fields[fieldCount++]);
      }
    }
  });

  return Swimmer;
};

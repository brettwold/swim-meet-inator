"use strict";

module.exports = function(sequelize, DataTypes) {
  var Club = sequelize.define("Club", {
    name: DataTypes.STRING,
    code: DataTypes.STRING(4),
    district: DataTypes.STRING(1),
    county: DataTypes.STRING(4),
    meet_name: DataTypes.STRING,
    address_line_1: DataTypes.STRING,
    address_line_2: DataTypes.STRING,
    town: DataTypes.STRING,
    county: DataTypes.STRING,
    post_code: DataTypes.STRING(10),
    telephone_no: DataTypes.STRING(17),
    email: DataTypes.STRING,
    special_notes: DataTypes.TEXT
  }, {
    classMethods: {
    	associate: function(models) {
        Club.hasMany(models.Swimmer);
    	}
    },
    indexes: [
      {
        unique: true,
        fields: ['code']
      }
    ]
  });

  return Club;
};

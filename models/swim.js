"use strict";

module.exports = function(sequelize, DataTypes) {
  var Swim = sequelize.define("swim", {
    meet_code: DataTypes.STRING
  }, {
    classMethods: {
	associate: function(models) {
		Swim.belongsTo(models.event, {
		  onDelete: "CASCADE",
		  foreignKey: {
		    allowNull: false
		  }
		});
	}
    }
  });

  return Swim;
};

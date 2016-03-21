"use strict";

module.exports = function(sequelize, DataTypes) {
  var Swim = sequelize.define("swim", {
    entry_time:	DataTypes.INTEGER,
    time: DataTypes.INTEGER,
    confirmed: DataTypes.BOOLEAN,
    combined_with: DataTypes.STRING,
    position: DataTypes.INTEGER,
    dq: DataTypes.BOOLEAN,
    dq_reason: DataTypes.STRING,
    meet_specific: DataTypes.STRING,
    seed_order: DataTypes.INTEGER,
    dns: DataTypes.BOOLEAN,
    notes: DataTypes.TEXT,
    points: DataTypes.INTEGER,
    heat: DataTypes.INTEGER,
    lane: DataTypes.INTEGER,
    prog_ref: DataTypes.INTEGER,
    withdrawn: DataTypes.BOOLEAN
  }, {
    classMethods: {
    	associate: function(models) {
    		Swim.belongsTo(models.event, {
    		  onDelete: "CASCADE",
    		  foreignKey: {
    		    allowNull: false
    		  }
    		});
        Swim.belongsTo(models.swimmer);
    	}
    }
  });

  return Swim;
};

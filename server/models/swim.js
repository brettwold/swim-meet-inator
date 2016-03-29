// ARES file lststart.txt
// Fields:
//      event;idRound;heat;lane;relay;idSwimmer

"use strict";

module.exports = function(sequelize, DataTypes) {
  var Swim = sequelize.define("Swim", {
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
    external_event_id: DataTypes.INTEGER,
    event_swimmer_id: DataTypes.INTEGER,
    prog_ref: DataTypes.INTEGER,
    withdrawn: DataTypes.BOOLEAN
  }, {
    classMethods: {
    	associate: function(models) {
    		Swim.belongsTo(models.Event, {
    		  onDelete: "CASCADE",
    		  foreignKey: {
    		    allowNull: false
    		  }
    		});
        Swim.belongsTo(models.Swimmer);
    	}
    },
    setterMethods: {
      fromData: function(data) {
        //      event;idRound;heat;lane;relay;idSwimmer
        var fields = data.split(';');
        var fieldCount = 0;

        this.setDataValue('external_event_id', parseInt(fields[fieldCount++]));
        fieldCount++;
        //this.setDataValue('round', fields[fieldCount++]);
        this.setDataValue('heat', parseInt(fields[fieldCount++]));
        this.setDataValue('lane', parseInt(fields[fieldCount++]));
        fieldCount++;
        //this.setDataValue('relay', fields[fieldCount++]);
        this.setDataValue('event_swimmer_id', parseInt(fields[fieldCount++]));
      }
    }
  });

  return Swim;
};

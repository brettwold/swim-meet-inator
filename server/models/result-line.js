// maps to ARES result list
// columns are:
//    event;round;heat;lap;lane;idStatus;rank;time;result;mod;btime;bresult;bmod
var Utils = require('../helpers/utils');

module.exports = function(sequelize, DataTypes) {

  var ResultLine = sequelize.define("ResultLine", {
		external_event_id: DataTypes.INTEGER,
		round: DataTypes.INTEGER,
		heat: DataTypes.INTEGER,
		lap: {
			type: DataTypes.INTEGER,
			validate: {
				isInt: true,
				min: 1
			}
		},
		lane: DataTypes.INTEGER,
		status: DataTypes.INTEGER,
		rank: DataTypes.INTEGER,
		time: DataTypes.INTEGER,
		result: DataTypes.STRING,
		mod: DataTypes.STRING,
		backup_time: DataTypes.INTEGER,
		backup_result: DataTypes.INTEGER,
		backup_mod: DataTypes.STRING,
  }, {
		classMethods: {
			associate: function(models) {
				ResultLine.belongsTo(models.Event);
			}
		},
		getterMethods: {
			fromData: function() {}
		},
		setterMethods: {
			fromData: function(data) {
				var fields = data.split(';');
				var fieldCount = 0;

				this.setDataValue('external_event_id', parseInt(fields[fieldCount++]));
				this.setDataValue('round', parseInt(fields[fieldCount++]));
				this.setDataValue('heat', parseInt(fields[fieldCount++]));
				this.setDataValue('lap', parseInt(fields[fieldCount++]));
				this.setDataValue('lane', parseInt(fields[fieldCount++]));
				this.setDataValue('status', fields[fieldCount++]);
				this.setDataValue('rank', parseInt(fields[fieldCount++]));
				this.setDataValue('time', parseInt(fields[fieldCount++]));
				this.setDataValue('result', Utils.trimQuotes(fields[fieldCount++]));
				this.setDataValue('mod', Utils.trimQuotes(fields[fieldCount++]));
				this.setDataValue('backup_time', parseInt(fields[fieldCount++]));
				this.setDataValue('backup_result', Utils.trimQuotes(fields[fieldCount++]));
				this.setDataValue('backup_mod', Utils.trimQuotes(fields[fieldCount++]));
		  }
		}

  });

  return ResultLine;
};

// maps to ARES result list
// columns are:
//    event;round;heat;lap;lane;idStatus;rank;time;result;mod;btime;bresult;bmod

function trimWhiteSpaceFromResultString(str) {
	return str.replace(/['"]+/g, '').trim();
}

module.exports = function(sequelize, DataTypes) {

  var ResultLine = sequelize.define("ResultLine", {
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
				ResultLine.belongsTo(models.event);
			}
		},
		getterMethods: {
			fromData: function() {}
		},
		setterMethods: {
			fromData: function(data) {
				var fields = data.split(';');
				var fieldCount = 0;

				this.setDataValue('event_id', fields[fieldCount++]);
				this.setDataValue('round', fields[fieldCount++]);
				this.setDataValue('heat', fields[fieldCount++]);
				this.setDataValue('lap', fields[fieldCount++]);
				this.setDataValue('lane', fields[fieldCount++]);
				this.setDataValue('status', fields[fieldCount++]);
				this.setDataValue('rank', fields[fieldCount++]);
				this.setDataValue('time', fields[fieldCount++]);
				this.setDataValue('result', trimWhiteSpaceFromResultString(fields[fieldCount++]));
				this.setDataValue('mod', trimWhiteSpaceFromResultString(fields[fieldCount++]));
				this.setDataValue('backup_time', fields[fieldCount++]);
				this.setDataValue('backup_result', trimWhiteSpaceFromResultString(fields[fieldCount++]));
				this.setDataValue('backup_mod', trimWhiteSpaceFromResultString(fields[fieldCount++]));
		  }
		}

  });

  return ResultLine;
};

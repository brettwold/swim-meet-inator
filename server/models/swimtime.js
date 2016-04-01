// ARES file lststart.txt
// Fields:
//      event;idRound;heat;lane;relay;idSwimmer

"use strict";

function round(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0)
    return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
    return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

module.exports = function(sequelize, DataTypes) {
  var SwimTime = sequelize.define("SwimTime", {
    source:	DataTypes.CHAR(3),
    course_type: DataTypes.CHAR(2),
    distance: DataTypes.INTEGER,
    stroke: DataTypes.CHAR(2),
    date: DataTypes.DATEONLY,
    time: DataTypes.INTEGER,
    time_orig: DataTypes.STRING,
    fina_points: DataTypes.INTEGER,
    meet_name: DataTypes.STRING,
    venue: DataTypes.STRING,
    license: DataTypes.STRING,
    level: DataTypes.INTEGER
  }, {
    classMethods: {
    	associate: function(models) {
        SwimTime.belongsTo(models.Swimmer);
    	}
    },
    getterMethods: {
      time_formatted  : function() {
        var hundredths = this.getDataValue('time');
        var seconds = Math.floor(hundredths / 100);
        var minutes = Math.floor(seconds / 60);
        var form = minutes+":"+padDigits(seconds-minutes*60, 2)+"."+("0"+(hundredths-seconds*100)).substr(-2);
        return form;
      }
    },
    setterMethods: {
      time_formatted  : function(timeStr) {
        this.setDataValue('time_orig', timeStr);
        var mins = 0;
        var tenths = 0;

        if(timeStr.indexOf(':') > -1) {
          var remain = timeStr.split(':');
          tenths += round(new Number(remain[0]) * 60 * 100, 0);
          timeStr = remain[1];
        }
        tenths += round(new Number(timeStr) * 100, 0);
        this.setDataValue('time', tenths);
      }
    }
  });

  return SwimTime;
};

var app = angular.module('SwimResultinator');
app.service('TimesheetParser', function(ConfigData, Timesheet) {
  function TimesheetParser() {
    ConfigData.getConfig().then(function(data) {
      this.config = data;
    });
  }
  TimesheetParser.prototype = {
    _getAliasMatch: function(chk, aliases) {
      for(key in aliases) {
        var aliasGroup = aliases[key];
        for(alias in aliasGroup) {
          if(aliasGroup[alias] == chk) {
            return key;
          }
        }
      }
    },
    _parseGender: function(genderString) {
      if (genderString) {
        var chk = genderString.trim().toLowerCase();
        return this._getAliasMatch(chk, config.gender_aliases);
      }
    },
    _parseGroupType: function(groupString) {
      if (groupString) {
        var chk = groupString.trim().toLowerCase();
        return this._getAliasMatch(chk, config.group_aliases);
      }
    },
    _parseRaceType: function(raceTypeString) {
      if (raceTypeString) {
        var chk = raceTypeString.trim().toLowerCase();
        for (race_type in config.races) {
          if (chk == config.races[race_type].name.toLowerCase()) {
            return race_type;
          }
        }
      }
    },
    _checkForGender: function(line, parseData) {
      var gender = this._parseGender(line);
      if (gender) {
        if (parseData.genders.indexOf(gender) < 0) {
          parseData.genders.push(gender);
        }
        return gender;
      }
    },
    _checkForHeadings: function(cols, gender, parseData) {
      var found = false;
      for (j = 0; j < cols.length; j++) {
        var group = this._parseGroupType(cols[j]);
        if (group) {
          console.log(parseData.entry_groups.indexOf(group));
          if (parseData.entry_groups.indexOf(group) < 0) {
            parseData.entry_groups.push(group);
          }
          parseData.sheet[gender][group] = {};
          found = true;
        }
      }
      return found;
    },
    _checkForRaceType: function(firstCol, parseData) {
      var raceType = this._parseRaceType(firstCol);
      if (raceType) {
        if (parseData.race_types.indexOf(raceType) < 0) {
          parseData.race_types.push(raceType);
        }
        return raceType;
      }
    },
    parseTime: function(timeStr) {
      if(timeStr) {
        var tArr = timeStr.split(/[\.:]+/);
        switch(tArr.length) {
          case 3:
            var m = parseInt(tArr[0] || 0) * 60 * 100;
            var s = parseInt(tArr[1] || 0) * 100;
            var h = parseInt(tArr[2] || 0);
            return m + s + h;
          case 2:
            var s = parseInt(tArr[0] || 0) * 100;
            var h = parseInt(tArr[1] || 0);
            return s + h;
          case 1:
          default:
            var s = parseInt(tArr[0] || 0) * 100;
            return s;
        }
      }
    },
    _checkForTimes: function(timeCols, colOffset, gender, raceType, parseData) {
      for(i = colOffset; i < timeCols.length; i++) {
        if(parseData.entry_groups.length > (i-colOffset)) {
          var time = this.parseTime(timeCols[i]);
          parseData.sheet[gender][parseData.entry_groups[i-colOffset]][raceType] = time;
        }
      }
    },
    parseTimesheet: function(importData) {
      var lines = importData.split('\n');
      var gender;
      console.log("Got lines: " + lines.length);
      if (lines && lines.length > 0) {
        var parseData = new Timesheet({ genders: [], entry_groups: [], race_types: [], sheet: {} });
        console.log("Found " + lines.length + " lines");
        var lineCount = 0;
        while(lineCount < lines.length) {
          console.log("Begin parse");
          var gender = this._checkForGender(lines[lineCount++], parseData);
          if(gender) {
            parseData.sheet[gender] = {};
            var cols = lines[lineCount++].split(',');
            console.log("Found " + cols.length + " columns");
            if (cols.length > 1) {
              if (this._checkForHeadings(cols, gender, parseData)) {
                do {
                  var timeCols = lines[lineCount].split(',');
                  console.log("Found " + timeCols.length + " time columns");
                  if (timeCols.length > 1) {
                    var raceType = this._checkForRaceType(timeCols[0], parseData);
                    if(raceType) {
                      this._checkForTimes(timeCols, 1, gender, raceType, parseData);
                    }
                    lineCount++;
                  }
                } while (lineCount < lines.length && timeCols.length > 1)
              }
            }
          }
        }
        console.log(parseData);
        return parseData;
      }
    }
  }

  return TimesheetParser;
});

var fs = require('fs');
var path = require('path');
var readline = require('readline');
var models = require('../models');
var parse = require('csv-parse');
var Utils = require('../helpers/utils');

const RESULTS_FILE = 'lstrslt.txt';
const SWIMMERS_FILE = 'lstconc.txt';
const SWIM_FILE = 'lststart.txt';

const STROKE_FILE = 'lststyle.txt';
const LENGTH_FILE = 'lstlong.txt';
const GROUPS_FILE = 'lstcat.txt';
const EVENTS_FILE = 'lstrace.txt';
const SWIMMER_FILE = 'lstconc.txt';
const START_FILE = 'lststart.txt';

var Results = function () {
  this.strokes = {};
  this.lengths = {};
  this.groups = {};
  this.events = {};
  this.startlist = {};
  this.swimmers = {};
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

Results.prototype._setupStaticData = function(dir) {
  var self = this;
  this._readStatic(dir, this._getFilenameCase(dir, STROKE_FILE), function(strokes) {
    for(i = 0; i < strokes.length; i++) {
      if (!isNaN(strokes[i][0])) {
        self.strokes[Utils.trimQuotes(strokes[i][0])] = {
          name: Utils.trimQuotes(strokes[i][1]),
          code: Utils.trimQuotes(strokes[i][2])
        };
      }
    }
  });
  this._readStatic(dir, this._getFilenameCase(dir, LENGTH_FILE), function(lengths) {
    for(i = 0; i < lengths.length; i++) {
      if (!isNaN(lengths[i][0])) {
        self.lengths[Utils.trimQuotes(lengths[i][0])] = {
          name: Utils.trimQuotes(lengths[i][1]),
          distance: Utils.trimQuotes(lengths[i][2])
        };
      }
    }
  });
  this._readStatic(dir, this._getFilenameCase(dir, GROUPS_FILE), function(groups) {
    for(i = 0; i < groups.length; i++) {
      if (groups[i][1]) {
        self.groups[Utils.trimQuotes(groups[i][1])] = { name: Utils.trimQuotes(groups[i][0]) };
      }
    }
  });
  this._readStatic(dir, this._getFilenameCase(dir, EVENTS_FILE), function(events) {
    // event;round;nbHeat;idLen;idStyle;abCat;date;time
    for(i = 0; i < events.length; i++) {
      self.events[Utils.trimQuotes(events[i][0])] = {
        round: Utils.trimQuotes(events[i][1]),
        heat: Utils.trimQuotes(events[i][2]),
        length: Utils.trimQuotes(events[i][3]),
        stroke: Utils.trimQuotes(events[i][4]),
        group: Utils.trimQuotes(events[i][5])
      };
    }
  });
  this._readStatic(dir, this._getFilenameCase(dir, START_FILE), function(startlist) {
    // event; round;heat;lane;relais;idBib;
    for(i = 0; i < startlist.length; i++) {
      var key = self._getStartListKey(Utils.trimQuotes(startlist[i][0]),
                              Utils.trimQuotes(startlist[i][1]),
                              Utils.trimQuotes(startlist[i][2]),
                              Utils.trimQuotes(startlist[i][3]));
      self.startlist[key] = Utils.trimQuotes(startlist[i][5]);
    }
  });
  this._readStatic(dir, this._getFilenameCase(dir, SWIMMER_FILE), function(swimmers) {
    // id;bib;lastname;firstname;birthyear;abNat;abCat
    for(i = 0; i < swimmers.length; i++) {
      self.swimmers[Utils.trimQuotes(swimmers[i][0])] = {
        bib: Utils.trimQuotes(swimmers[i][1]),
        lastname: Utils.trimQuotes(swimmers[i][2]),
        firstname: Utils.trimQuotes(swimmers[i][3]),
        dob: Utils.trimQuotes(swimmers[i][4]),
        club: Utils.trimQuotes(swimmers[i][5]),
        group: Utils.trimQuotes(swimmers[i][6])
      };
    }
  });
}

Results.prototype._getStartListKey = function(eventid, round, heat, lane) {
  return eventid + "-" + round + "-" + heat + "-" + lane;
}

Results.prototype._readStatic = function(dir, filename, callback) {
  if(dir && filename && this._exists(dir, filename)) {
    var output = [];
    var parser = parse({delimiter: ';', relax: true, relax_column_count: true });
    parser.on('readable', function(){
      while(record = parser.read()){
        output.push(record);
      }
    });
    parser.on('error', function(err){
      console.log(err.message);
    });
    parser.on('finish', function(){
      callback(output);
    });

    var filePath = path.join(dir, filename);
    var input = fs.createReadStream(filePath);
    input.pipe(parser);
  }
}

Results.prototype._getFilenameCase = function(dir, filename) {
	if(this._exists(dir, filename.toLowerCase())) {
		return filename.toLowerCase();
	} else if(this._exists(dir, filename.toUpperCase())) {
		return filename.toUpperCase();
	}
	return;
}

Results.prototype._readAresFile = function(dir, filename, model, callback) {

	if(filename) {
		var self = this;
		var resultData = new Array();
		var filePath = path.join(dir, filename);
		var lineReader = readline.createInterface({
			input: fs.createReadStream(filePath)
		});

		lineReader.on('line', function (line) {
			var lineData = model.build({fromData: line});
      lineData.validate().then(function(errs) {
				if(!errs) {
					resultData.push(lineData);
				}
			});
		});

		lineReader.on('close', function() {
      var response = {};
      response.results = resultData;
      response.strokes = self.strokes;
      response.lengths = self.lengths;
      response.groups = self.strokes;
      response.events = self.events;
      callback(response);
		});
	} else {
		callback();
	}
};

Results.prototype._exists = function(dir, filename) {
	var resFile = path.join(dir, filename);
	try {
		fs.accessSync(resFile, fs.F_OK);
		return true;
	} catch (e) {
		return false;
	}
}

Results.prototype.results = function(dir, session, callback) {
  var self = this;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  this._setupStaticData(dir);

  this._readAresFile(dir, this._getFilenameCase(dir, RESULTS_FILE), models.ResultLine, function(resultLines) {
    var eventResults = {};
    if (resultLines) {
      console.log("Read " + resultLines.results.length + " lines in " + dir);
      eventResults.resultLineCount = resultLines.results.length;
      for(i = 0; i < resultLines.results.length; i++) {
        var eventId = resultLines.results[i].external_event_id;
        if(resultLines.results[i].lap == self.lengths[self.events[eventId].length].distance) {
          var event = eventResults[eventId];
          if (!event) {
            event = {
              id: eventId,
              stroke: self.events[eventId].stroke,
              length: self.events[eventId].length,
              group: self.events[eventId].group,
              title: self.groups[self.events[eventId].group].name + " " +
                  self.lengths[self.events[eventId].length].name + " " +
                  self.strokes[self.events[eventId].stroke].name,
              results: []
            };
          }

          var result = resultLines.results[i];
          var heat = event.results[result.heat];
          if (!heat) {
            heat = new Array();
          }

          var swimmer = self.swimmers[self.startlist[self._getStartListKey(event.id, result.round, result.heat, result.lane)]];

          heat.push({
            lane: result.lane,
            rank: result.rank,
            time: result.time,
            result: result.result,
            backup_time: result.backup_time,
            backup_result: result.backup_result,
            swimmer: swimmer
          });

          event.results[result.heat] = heat;

          eventResults[eventId] = event;
        }
      }
    }
    callback(eventResults, session);
  });
};

module.exports = Results;

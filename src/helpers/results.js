import fs from 'fs';
import path from 'path';
import readline from 'readline';
import models from '../models';
import parse from 'csv-parse';
import Utils from '../helpers/utils';

const RESULTS_FILE = 'lstrslt.txt';
const SWIMMERS_FILE = 'lstconc.txt';
const SWIM_FILE = 'lststart.txt';

const STROKE_FILE = 'lststyle.txt';
const LENGTH_FILE = 'lstlong.txt';
const GROUPS_FILE = 'lstcat.txt';
const EVENTS_FILE = 'lstrace.txt';
const SWIMMER_FILE = 'lstconc.txt';
const START_FILE = 'lststart.txt';

export default class Results {
  strokes = {};
  lengths = {};
  groups = {};
  events = {};
  startlist = {};
  swimmers = {};

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  _setupStaticData(dir) {
    this._readStatic(dir, this._getFilenameCase(dir, STROKE_FILE), (strokes) => {
      for(let i = 0; i < strokes.length; i++) {
        if (!isNaN(strokes[i][0])) {
          this.strokes[Utils.trimQuotes(strokes[i][0])] = {
            name: Utils.trimQuotes(strokes[i][1]),
            code: Utils.trimQuotes(strokes[i][2])
          };
        }
      }
    });

    this._readStatic(dir, this._getFilenameCase(dir, LENGTH_FILE), (lengths) => {
      for(let i = 0; i < lengths.length; i++) {
        if (!isNaN(lengths[i][0])) {
          this.lengths[Utils.trimQuotes(lengths[i][0])] = {
            name: Utils.trimQuotes(lengths[i][1]),
            distance: Utils.trimQuotes(lengths[i][2])
          };
        }
      }
    });

    this._readStatic(dir, this._getFilenameCase(dir, GROUPS_FILE), (groups) => {
      for(let i = 0; i < groups.length; i++) {
        if (groups[i][1]) {
          this.groups[Utils.trimQuotes(groups[i][1])] = { name: Utils.trimQuotes(groups[i][0]) };
        }
      }
    });

    this._readStatic(dir, this._getFilenameCase(dir, EVENTS_FILE), (events) => {
      // event;round;nbHeat;idLen;idStyle;abCat;date;time
      for(let i = 0; i < events.length; i++) {
        this.events[Utils.trimQuotes(events[i][0])] = {
          round: Utils.trimQuotes(events[i][1]),
          heat: Utils.trimQuotes(events[i][2]),
          length: Utils.trimQuotes(events[i][3]),
          stroke: Utils.trimQuotes(events[i][4]),
          group: Utils.trimQuotes(events[i][5])
        };
      }
    });

    this._readStatic(dir, this._getFilenameCase(dir, START_FILE), (startlist) => {
      // event; round;heat;lane;relais;idBib;
      for(let i = 0; i < startlist.length; i++) {
        let key = this._getStartListKey(Utils.trimQuotes(startlist[i][0]),
                                Utils.trimQuotes(startlist[i][1]),
                                Utils.trimQuotes(startlist[i][2]),
                                Utils.trimQuotes(startlist[i][3]));
        this.startlist[key] = Utils.trimQuotes(startlist[i][5]);
      }
    });

    this._readStatic(dir, this._getFilenameCase(dir, SWIMMER_FILE), (swimmers) => {
      // id;bib;lastname;firstname;birthyear;abNat;abCat
      for(let i = 0; i < swimmers.length; i++) {
        this.swimmers[Utils.trimQuotes(swimmers[i][0])] = {
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

  _getStartListKey(eventid, round, heat, lane) {
    return eventid + "-" + round + "-" + heat + "-" + lane;
  }

  _readStatic(dir, filename, callback) {
    console.log("Reading " + this._exists(dir, filename) +  filename + " from " + dir);

    if(dir && filename && this._exists(dir, filename)) {
      var output = [];
      var parser = parse({delimiter: ';', relax: true, relax_column_count: true });
      parser.on('readable', () => {
        let record;
        while(record = parser.read()){
          output.push(record);
        }
      });
      parser.on('error', (err) => {
        console.log(err.message);
      });
      parser.on('finish', () =>{
        callback(output);
      });

      var filePath = path.join(dir, filename);
      var input = fs.createReadStream(filePath);
      input.pipe(parser);
    }
  }

  _getFilenameCase(dir, filename) {
  	if(this._exists(dir, filename.toLowerCase())) {
  		return filename.toLowerCase();
  	} else if(this._exists(dir, filename.toUpperCase())) {
  		return filename.toUpperCase();
  	}
  	return;
  }

  _readAresFile(dir, filename, model, callback) {
  	if(filename) {
  		let resultData = new Array();
  		let filePath = path.join(dir, filename);
  		let lineReader = readline.createInterface({
  			input: fs.createReadStream(filePath)
  		});

  		lineReader.on('line', (line) => {
  			let lineData = model.build({fromData: line});
        lineData.validate().then((errs) => {
  				if(!errs) {
  					resultData.push(lineData);
  				}
  			});
  		});

  		lineReader.on('close', () => {
        let response = {};
        response.results = resultData;
        response.strokes = this.strokes;
        response.lengths = this.lengths;
        response.groups = this.strokes;
        response.events = this.events;
        callback(response);
  		});
  	} else {
  		callback();
  	}
  }

  _exists(dir, filename) {
  	let resFile = path.join(dir, filename);
  	try {
  		fs.accessSync(resFile, fs.F_OK);
  		return true;
  	} catch (e) {
  		return false;
  	}
  }

  results(dir, session, callback) {
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    this._setupStaticData(dir);

    this._readAresFile(dir, this._getFilenameCase(dir, RESULTS_FILE), models.ResultLine, (resultLines) => {
      let eventResults = {};
      if (resultLines) {
        console.log("Read " + resultLines.results.length + " lines in " + dir);
        console.log(this.events);
        eventResults.resultLineCount = resultLines.results.length;
        for(let i = 0; i < resultLines.results.length; i++) {
          var eventId = resultLines.results[i].external_event_id;
          if(resultLines.results[i].lap == this.lengths[this.events[eventId].length].distance) {
            var event = eventResults[eventId];
            if (!event) {
              event = {
                id: eventId,
                stroke: this.events[eventId].stroke,
                length: this.events[eventId].length,
                group: this.events[eventId].group,
                title: this.groups[this.events[eventId].group].name + " " +
                    this.lengths[this.events[eventId].length].name + " " +
                    this.strokes[this.events[eventId].stroke].name,
                results: []
              };
            }

            let result = resultLines.results[i];
            let heat = event.results[result.heat];
            if (!heat) {
              heat = new Array();
            }

            var swimmer = this.swimmers[this.startlist[this._getStartListKey(event.id, result.round, result.heat, result.lane)]];

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
  }

}

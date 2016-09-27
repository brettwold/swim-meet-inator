var fs = require('fs');
var path = require('path');
var readline = require('readline');
var models = require('../models');
var parse = require('csv-parse');

const RESULTS_FILE = 'lstrslt.txt';
const SWIMMERS_FILE = 'lstconc.txt';
const SWIM_FILE = 'lststart.txt';

const STROKE_FILE = 'lststyle.txt';
const LENGTH_FILE = 'lstlong.txt';
const GROUPS_FILE = 'lstcat.txt';

var Results = function () {
  this.strokes = {};
  this.lengths = {};
  this.groups = {};
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

Results.prototype.setupStaticData = function(dir) {
  var self = this;
  this.readStatic(dir, this.getFilenameCase(dir, STROKE_FILE), function(strokes) {
    for(i = 0; i < strokes.length; i++) {
      if (!isNaN(strokes[i][0])) {
        self.strokes[strokes[i][0]] = { name: strokes[i][1], code: strokes[i][2] };
      }
    }
  });
  this.readStatic(dir, this.getFilenameCase(dir, LENGTH_FILE), function(lengths) {
    for(i = 0; i < lengths.length; i++) {
      if (!isNaN(lengths[i][0])) {
        self.lengths[lengths[i][0]] = { name: lengths[i][1], distance: lengths[i][2] };
      }
    }
  });
  this.readStatic(dir, this.getFilenameCase(dir, GROUPS_FILE), function(groups) {
    for(i = 0; i < groups.length; i++) {
      self.groups[groups[i][1]] = { name: groups[i][0] };
    }
  });
}

Results.prototype.readStatic = function(dir, filename, callback) {

  var output = [];
  var parser = parse({delimiter: ';', relax: true});
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
  input.pipe(parser)
}

Results.prototype.getFilenameCase = function(dir, filename) {
	if(this.exists(dir, filename.toLowerCase())) {
		return filename.toLowerCase();
	} else if(this.exists(dir, filename.toUpperCase())) {
		return filename.toUpperCase();
	}
	return;
}

Results.prototype.results = function(dir, callback) {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  this.setupStaticData(dir);

  this.readAresFile(dir, this.getFilenameCase(dir, RESULTS_FILE), models.ResultLine, callback);
};

Results.prototype.swimmers = function(dir, callback) {
	this.readAresFile(dir, this.getFilenameCase(dir, SWIMMERS_FILE), models.Swimmer, callback);
};

Results.prototype.swims = function(dir, callback) {
	this.readAresFile(dir, this.getFilenameCase(dir, SWIM_FILE), models.Swim, callback);
};

Results.prototype.readAresFile = function(dir, filename, model, callback) {

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
      response.groups = self.strogroupskes;
			callback(response);
		});
	} else {
		callback();
	}
};

Results.prototype.detectAresResults = function(dir, done) {
	var self = this;
	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		var pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(function(file) {
			file = path.resolve(dir, file);
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					self.detectAresResults(file, function(err, res) {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					if(file.endsWith(RESULTS_FILE.toLowerCase()) || file.endsWith(RESULTS_FILE.toUpperCase())) {
						results.push(dir);
					}
					if (!--pending) done(null, results);
				}
			});
		});
	});
};

Results.prototype.walk = function(root, callback) {

	var self = this;
	var meetResults = {meets: []};

	self.detectAresResults(root, function(err, results) {
		if (err) throw err;
    callback(results);
	});
}

Results.prototype.exists = function(dir, filename) {
	var resFile = path.join(dir, filename);
	try {
		fs.accessSync(resFile, fs.F_OK);
		return true;
	} catch (e) {
		return false;
	}
}

Results.prototype.meet = function(dir, callback) {

	var self = this;

	self.results(dir, function(results) {
		self.swimmers(dir, function(swimmers) {
			self.swims(dir, function(swims) {
				callback({name: dir, results: results, swimmers: swimmers, swims: swims});
			});
		});
	});
}

module.exports = Results;

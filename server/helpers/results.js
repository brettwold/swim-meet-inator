var fs = require('fs');
var path = require('path');
var readline = require('readline');
var models = require('../models');

const RESULTS_FILE = 'lstrslt.txt';
const SWIMMERS_FILE = 'lstconc.txt';
const SWIM_FILE = 'lststart.txt';

var Results = function () {

};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
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
			callback(resultData);
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

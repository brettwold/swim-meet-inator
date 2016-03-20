var fs = require('fs');
var readline = require('readline');
var models = require('../models');

var Results = function () {
	this.resultData = new Array();
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

Results.prototype.open = function(dir, callback) {

	var self = this;

	var lineReader = readline.createInterface({
	  input: fs.createReadStream(dir + '/lstrslt.txt')
	});

	lineReader.on('line', function (line) {
		var lineData = models.ResultLine.build({fromData: line});
		lineData.validate().then(function(errs) {
			if(!errs) {
				self.resultData.push(lineData);
			}

		});
	});

	lineReader.on('close', function() {
	    callback();
	});
};

module.exports = Results;

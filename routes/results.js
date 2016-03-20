var express = require('express');
var router = express.Router();

var Results = require('../helpers/results');
console.log(__dirname);

/* GET results listing. */
router.get('/', function(req, res, next) {

  var results = new Results();
  results.open(process.cwd() + '/data', function() {
    res.json(results.resultData);
  });
});

module.exports = router;

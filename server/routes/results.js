var express = require('express');
var router = express.Router();

var Results = require('../helpers/results');

/* GET results listing. */
router.get('/', function(req, res, next) {

  var results = new Results();
  results.results(process.cwd() + '/data', function() {
    res.json(results.resultData);
  });
});

router.get('/swimmers', function(req, res, next) {

  var results = new Results();
  results.swimmers(process.cwd() + '/data', function(resultData) {
    res.json(resultData);
  });
});

router.get('/swims', function(req, res, next) {

  var results = new Results();
  results.swims(process.cwd() + '/data', function(resultData) {
    res.json(resultData);
  });
});

router.get('/walk', function(req, res, next) {
  var results = new Results();
  results.walk(process.cwd() + '/data/swimresults', function(resultData) {
    res.json(resultData);
  });
});

module.exports = router;

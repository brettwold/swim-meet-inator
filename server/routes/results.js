var express = require('express');
var router = express.Router();

var Meet = require('../models').Meet;
var Results = require('../helpers/results');

const BASE_DIR = process.cwd() + '/data';
const MEET_RESULT_DIR = BASE_DIR + '/meet/';

router.get('/:meetId', function(req, res, next) {
  Meet.findById(req.params.meetId).then(function(meet) {
    if (meet) {
      var results = new Results();
      results.results(MEET_RESULT_DIR + meet.id, function(resultData) {
        res.json(resultData);
      });
    } else {
      res.status(404).send('Meet not found');
    }
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

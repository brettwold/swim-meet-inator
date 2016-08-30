var express = require('express');
var router = express.Router();

var swimData = require('../helpers/swimdata');
var Swimmer = require('../models').Swimmer;
var SwimTime = require('../models').SwimTime;

router.get('/best/:swimmerid', function(req, res, next) {
  SwimTime.findAll({ where: { swimmer_id: req.params.swimmerid }, order: [ 'race_type' ], group: 'race_type' } ).then(function(result) {
    res.json(result);
  });
});

router.get('/:swimmerid/:racetype', function(req, res, next) {
  SwimTime.findAll({ where: { swimmer_id: req.params.swimmerid, race_type: req.params.racetype }, order: [ 'time' ] } ).then(function(result) {
    res.json(result);
  });
});

router.get('/:swimmerid', function(req, res, next) {
  SwimTime.findAll({ where: { swimmer_id: req.params.swimmerid }, order: [ 'race_type' ] } ).then(function(result) {
    res.json(result);
  });
});


module.exports = router;

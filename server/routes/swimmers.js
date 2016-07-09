var express = require('express');
var router = express.Router();

var Club = require('../models').Club;
var Swimmer = require('../models').Swimmer;
var SwimTime = require('../models').SwimTime;

var INCLUDES = [ { model: SwimTime, as: "swim_times" } ];

router.get('/', function(req, res, next) {

  Swimmer.findAndCountAll({
    order: 'last_name ASC',
    offset: 0,
    limit: 10,
    include: INCLUDES
  })
  .then(function(result) {
    console.log(result.count);
    res.json(result);
  });
});

router.get('/:id', function(req, res, next) {
  Swimmer.findById(req.params.id, { include: INCLUDES } ).then(function(result) {
    res.json(result);
  });
});

router.put('/save', function(req, res, next) {
  if(!req.body.id) {
    Swimmer.create(req.body).then(function(result) {
      res.json(result);
    });
  } else {
    Swimmer.update(req.body, { where: {id: req.body.id }}).then(function(result) {
      res.json(req.body);
    });
  }
});

router.get('/delete/:id', function(req, res, next) {
  Swimmer.findById(req.params.id).then(function(result) {
    result.destroy();
    res.json({status: "ok"});
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();

var Club = require('../models').Club;
var Swimmer = require('../models').Swimmer;
var SwimTime = require('../models').SwimTime;

router.get('/', function(req, res, next) {

  Swimmer.findAndCountAll({
    offset: 0,
    limit: 10
  })
  .then(function(result) {
    console.log(result.count);
    res.json(result);
  });
});

router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  Swimmer.findById(req.params.id, { include: [ SwimTime ]}).then(function(result) {
    res.json(result);
  });
});

router.post('/add', function(req, res, next) {
  Swimmer.upsert(req.body);
});

router.get('/delete/:id', function(req, res, next) {
  Swimmer.findById(req.params.id).then(function(result) {
    result.destroy();
    res.json({status: "ok"});
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();

var Club = require('../models').Club;
var Swimmer = require('../models').Swimmer;

router.get('/:id', function(req, res, next) {
  Swimmer.log(req.params.id);
  Swimmer.findById(req.params.id).then(function(result) {
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

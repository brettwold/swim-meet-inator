var express = require('express');
var router = express.Router();

var Club = require('../models').Club;
var Swimmer = require('../models').Swimmer;

/* GET meets listing. */
router.get('/', function(req, res, next) {

  Club.findAndCountAll({
    offset: 0,
    limit: 10
  })
  .then(function(result) {
    console.log(result.count);
    console.log(result.rows);
    res.json(result);
  });
});

router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  Club.findById(req.params.id).then(function(result) {
    res.json(result);
  });
});

router.post('/add', function(req, res, next) {
  Club.upsert(req.body);
});

router.post('/addswimmer', function(req, res, next) {
  Swimmer.upsert(req.body);
});

router.get('/delete/:id', function(req, res, next) {
  Club.findById(req.params.id).then(function(result) {
    result.destroy();
    res.json({status: "ok"});
  });
});

module.exports = router;

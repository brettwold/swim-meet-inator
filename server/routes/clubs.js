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
    res.json(result);
  });
});

router.get('/:id', function(req, res, next) {
  Club.findById(req.params.id).then(function(result) {
    res.json(result);
  });
});

router.get('/:id/swimmers', function(req, res, next) {
  Swimmer.findAndCountAll({
    offset: 0,
    limit: 10,
    where: { club_id: req.params.id }
  })
  .then(function(result) {
    res.json(result);
  });
});

router.put('/save', function(req, res, next) {
  if(!req.body.id) {
    Club.create(req.body).then(function(result) {
      res.json(result);
    });
  } else {
    Club.update(req.body, { where: {id: req.body.id }}).then(function(result) {
      res.json(req.body);
    });
  }
});

router.post('/addswimmer', function(req, res, next) {
  Swimmer.upsert(req.body).then(function(swimmer) {
    res.json(swimmer);
  });
});

router.post('/deleteswimmer', function(req, res, next) {
  Swimmer.findById(req.body.id).then(function(swimmer) {
    var club_id = swimmer.club_id;
    swimmer.destroy().then(function() {
      next('/' + club_id + '/swimmers');
    });
  })
});

router.get('/delete/:id', function(req, res, next) {
  Club.findById(req.params.id).then(function(result) {
    result.destroy();
    res.json({status: "ok"});
  });
});

module.exports = router;

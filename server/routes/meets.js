var express = require('express');
var router = express.Router();

var Meet = require('../models').Meet;
var Timesheet = require('../models').Timesheet;

var INCLUDES = [ { model: Timesheet, as: 'minimum_timesheet' }, { model: Timesheet, as: 'maximum_timesheet' } ];

/* GET meets listing. */
router.get('/', function(req, res, next) {

  Meet.findAll({
    offset: 0,
    limit: 10,
    include: INCLUDES,
    order: [['meet_date', 'DESC']]
  })
  .then(function(result) {
    res.json(result);
  });
});

router.get('/current', function(req, res, next) {

  Meet.findAll({
    where: {
      is_complete: 0
    },
    offset: 0,
    limit: 10,
    include: INCLUDES,
    order: [['meet_date', 'DESC']]
  })
  .then(function(result) {
    res.json(result);
  });
});

router.get('/:id', function(req, res, next) {
  Meet.findById(req.params.id, { include: INCLUDES }).then(function(result) {
    res.json(result);
  });
});

router.put('/save', function(req, res, next) {
  if(!req.body.id) {
    var meet = Meet.build(req.body);
    meet.save().then(function(result) {
      res.json(result);
    });
  } else {
    Meet.findById(req.body.id).then(function(meet) {
      meet.updateAttributes(req.body);

      meet.save().then(function(){
        res.json(meet);
      }).catch(function(error) {
        console.log(error);
      });
    });
  }
});

router.get('/delete/:id', function(req, res, next) {
  Meet.findById(req.params.id).then(function(result) {
    result.destroy();
    res.json({status: "ok"});
  });
});

module.exports = router;

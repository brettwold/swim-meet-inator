var express = require('express');
var router = express.Router();

var Timesheet = require('../models').Timesheet;

/* GET meets listing. */
router.get('/', function(req, res, next) {

  Timesheet.findAndCountAll({
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
  Timesheet.findById(req.params.id).then(function(result) {
    res.json(result);
  });
});

router.post('/save', function(req, res, next) {
  if(!req.body.id) {
    Timesheet.create(req.body).then(function(result) {
      res.json(result);
    });
  } else {
    Timesheet.update(req.body, { where: {id: req.body.id }}).then(function(result) {
      res.json(req.body);
    });
  }
});

router.get('/delete/:id', function(req, res, next) {
  Timesheet.findById(req.params.id).then(function(result) {
    result.destroy();
    res.json({status: "ok"});
  });
});

module.exports = router;
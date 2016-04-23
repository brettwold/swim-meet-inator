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
  Timesheet.findById(req.params.id).then(function(result) {
    res.json(result);
  });
});

router.post('/save', function(req, res, next) {
  console.log(JSON.stringify(req.body));

  if(!req.body.id) {
    var ts = Timesheet.build(req.body);
    ts.save().then(function(result) {
      res.json(result);
    });
  } else {
    Timesheet.findById(req.body.id).then(function(ts){
      console.log("DATA: " + req.body.entry_groups_arr);
      ts.updateAttributes(req.body);

      ts.save().then(function(){
        res.json(req.body);
      }).catch(function(error) {
        console.log(error);
      });
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

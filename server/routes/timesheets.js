var express = require('express');
var router = express.Router();

var Timesheet = require('../models').Timesheet;
var TimesheetEntry = require('../models').TimesheetEntry;
var TimesheetEntrytime = require('../models').TimesheetEntrytime;


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

function updateEntries(entries, timesheet_id) {
  for(gender in entries) {
    for(stroke in entries[gender]) {
      for(distance in entries[gender][stroke]) {
        for(group in entries[gender][stroke][distance]) {
          var tEntry = {
            timesheet_id: timesheet_id,
            gender: gender,
            stroke: stroke,
            distance: distance
          };
          TimesheetEntry.findOrCreate({ where: tEntry }).then(function(ent) {
            for(time in entries[gender][stroke][distance][group]) {
              var entrytime = TimesheetEntrytime.build();
              entrytime.timesheet_entry_id = ent.id;
              entrytime.entry_group = group;
              entrytime.time = time;
              TimesheetEntrytime.upsert(entrytime);
            }
          });
        }
      }
    }
  }
}

router.post('/save', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  if(!req.body.id) {
    Timesheet.create(req.body).then(function(result) {
      res.json(result);
    });
  } else {
    Timesheet.update(req.body, { where: {id: req.body.id }}).then(function(result) {
      if(req.body.entries) {
        updateEntries(req.body.entries, req.body.id);
      }
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

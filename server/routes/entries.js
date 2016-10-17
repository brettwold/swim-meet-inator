var express = require('express');
var router = express.Router();

var Entry = require('../models').Entry;
var Swimmer = require('../models').Swimmer;
var SwimTime = require('../models').SwimTime;

var INCLUDES = [
  { model: Swimmer, as: 'swimmer' },
  { model: SwimTime, as: 'entry_times'}
];

router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  Entry.findById(req.params.id).then(function(result) {
    res.json(result);
  });
});

router.get('/meet/:meetId', function(req, res, next) {

  Entry.findAll({
    where: {
      meet_id: req.params.meetId
    },
    offset: 0,
    limit: 10,
    include: INCLUDES,
    order: [['updated_at', 'DESC']]
  }).then(function(result) {
    console.log(result);
    res.json(result);
  }).catch(function(err) {
    console.log(err);
    res.status(404).send('Entries not found');
  });
});

router.put('/save', function(req, res, next) {
  if(!req.body.id) {
    var entry = Entry.build(req.body);
    entry.save().then(function(result) {
      res.json(result);
    });
  } else {
    Entry.findById(req.body.id).then(function(entry) {
      entry.updateAttributes(req.body);

      entry.save().then(function(){
        res.json(entry);
      }).catch(function(error) {
        console.log(error);
      });
    });
  }

  Entry.upsert(req.body);
});

router.get('/delete/:id', function(req, res, next) {
  Entry.findById(req.params.id).then(function(result) {
    result.destroy();
    res.json({status: "ok"});
  });
});

module.exports = router;

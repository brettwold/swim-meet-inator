var express = require('express');
var router = express.Router();

var Entry = require('../models').Entry;
var Swimmer = require('../models').Swimmer;
var Meet = require('../models').Meet;
var SwimTime = require('../models').SwimTime;

var INCLUDES = [
  { model: Swimmer, as: 'swimmer' },
  { model: SwimTime, through: 'entrytime', as: 'entrytimes' }
];

router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  Entry.findOne({
    where: { id: req.params.id },
    include: INCLUDES
  }).then(function(result) {
    res.json(result);
  }).catch(function(err) {
    console.log(err);
    res.status(404).send('Entry not found');
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
    res.json(result);
  }).catch(function(err) {
    console.log(err);
    res.status(404).send('Entries not found');
  });
});

router.put('/save', function(req, res, next) {
  var entryData = req.body;
  var entry = Entry.build(entryData);
  entry.setEntrytimes(SwimTime.build(entryData.entrytimes));
  entry.save().then(function(entry) {
    res.json(entry);
  }).catch(function(error) {
    next(error);
  });
});

router.get('/delete/:id', function(req, res, next) {
  Entry.findById(req.params.id).then(function(result) {
    result.destroy();
    res.json({status: "ok"});
  }).catch(function(error) {
    next(error);
  });
});

module.exports = router;

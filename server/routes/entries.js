var express = require('express');
var router = express.Router();

var Entry = require('../models').Entry;

/* GET meets listing. */
router.get('/', function(req, res, next) {

  Entry.findAndCountAll({
    offset: 0,
    limit: 10
  })
  .then(function(result) {
    res.json(result);
  });
});

router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  Entry.findById(req.params.id).then(function(result) {
    res.json(result);
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

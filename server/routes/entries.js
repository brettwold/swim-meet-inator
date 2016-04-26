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

router.post('/add', function(req, res, next) {
  Entry.upsert(req.body);
});

router.get('/delete/:id', function(req, res, next) {
  Entry.findById(req.params.id).then(function(result) {
    result.destroy();
    //res.json({status: "ok"});
  });
});

module.exports = router;

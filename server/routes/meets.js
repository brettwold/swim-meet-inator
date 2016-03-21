var express = require('express');
var router = express.Router();

var Meet = require('../models').meet;

router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  Meet.findById(req.params.id).then(function(result) {
    res.json(result);
  });
});

/* GET meets listing. */
router.get('/', function(req, res, next) {
  Meet.findAndCountAll({
       offset: 0,
       limit: 10
    })
    .then(function(result) {
      console.log(result.count);
      console.log(result.rows);
      res.json(result);
    });
});

router.post('/add', function(req, res, next) {
  Meet.upsert(req.body);
});

router.get('/delete/:id', function(req, res, next) {
  Meet.findById(req.params.id).then(function(result) {
    result.destroy();
    //res.json({status: "ok"});
  });
});

module.exports = router;

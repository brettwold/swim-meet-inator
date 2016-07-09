var express = require('express');
var router = express.Router();

var Meet = require('../models').Meet;

/* GET meets listing. */
router.get('/', function(req, res, next) {

  Meet.findAndCountAll({
    offset: 0,
    limit: 10
  })
  .then(function(result) {
    res.json(result);
  });
});

router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  Meet.findById(req.params.id).then(function(result) {
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
      console.log("meet data: " + JSON.stringify(req.body));
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

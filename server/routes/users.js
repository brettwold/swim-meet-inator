var express = require('express');
var router = express.Router();

var User = require('../models').User;
var Swimmer = require('../models').Swimmer;

var INCLUDES = [
  { model: Swimmer, through: 'UserSwimmers', as: "swimmers" }
];

router.get('/', function(req, res, next) {
  User.findAll({
    offset: 0,
    limit: 10,
  })
  .then(function(result) {
    res.json(result);
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  });
});

router.get('/:id', function(req, res, next) {
  User.findOne({
    where: { id: req.params.id },
    include: INCLUDES
  }).then(function(result) {
    res.json(result);
  }).catch(function(err) {
    console.log(err);
    next(err);
  });
});

router.put('/save', function(req, res, next) {
  if(!req.body.id) {
    User.create(req.body).then(function(result) {
      res.json(result);
    });
  } else {
    User.update(req.body, { where: {id: req.body.id }}).then(function(result) {
      res.json(req.body);
    });
  }
});

router.get('/delete/:id', function(req, res, next) {
  User.findById(req.params.id).then(function(result) {
    result.destroy();
    res.json({status: "ok"});
  });
});

module.exports = router;

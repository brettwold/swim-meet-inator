var express = require('express');
var router = express.Router();

var Club = require('../models').Club;
var User = require('../models').User;
var Swimmer = require('../models').Swimmer;
var SwimTime = require('../models').SwimTime;
var sequelize = require('../models').sequelize;

var INCLUDES = [{
  model: SwimTime, as: "swim_times"
}];

router.get('/', function(req, res, next) {

  Swimmer.findAll({
    order: 'last_name ASC',
    offset: 0,
    limit: 10
  })
  .then(function(result) {
    res.json(result);
  });
});

router.get('/user', function(req, res, next) {
  var user = User.build(req.user);
  user.getSwimmers().then(function(swimmers) {
    res.json(swimmers);
  }).catch(function(err) {
    res.json([]);
  });
});

router.put('/addtouser/:swimmerid', function(req, res, next) {
  var user = User.build(req.user);
  Swimmer.findById(req.params.swimmerid).then(function(swimmer) {
    user.addSwimmer(swimmer).then(function(response){
      res.json(user.getSwimmers());
    });
  });
});

router.put('/removefromuser/:swimmerid', function(req, res, next) {
  var user = User.build(req.user);
  Swimmer.findById(req.params.swimmerid).then(function(swimmer) {
    user.removeSwimmer(swimmer).then(function(response){
      res.json(user.getSwimmers());
    });
  });
});

router.get('/:id', function(req, res, next) {
  Swimmer.findById(req.params.id, {
    include: INCLUDES,
    order: [ 'race_type', sequelize.fn('min', sequelize.col('time')) ],
    group: ['race_type']
  }).then(function(swimmer) {
    if(swimmer) {
      res.json(swimmer);
    } else {
      res.status(404).send('Swimmer not found');
    }
  });
});

router.get('/regno/:regno', function(req, res, next) {
  Swimmer.find({where: {regno: req.params.regno}}, {
    include: INCLUDES,
    order: [ 'race_type', sequelize.fn('min', sequelize.col('time')) ],
    group: ['race_type']
  }).then(function(swimmer) {
    if(swimmer) {
      res.json(swimmer);
    } else {
      res.status(404).send('Swimmer not found');
    }
  });
});

router.put('/save', function(req, res, next) {
  if(!req.body.id) {
    Swimmer.create(req.body).then(function(result) {
      res.json(result);
    });
  } else {
    Swimmer.update(req.body, { where: {id: req.body.id }}).then(function(result) {
      res.json(req.body);
    });
  }
});

router.get('/delete/:id', function(req, res, next) {
  Swimmer.findById(req.params.id).then(function(result) {
    result.destroy();
    res.json({status: "ok"});
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();

var Meet = require('../models').meet;

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
  console.log("Got a request to add " + JSON.stringify(req.body));

  Meet.create(req.body);
});

module.exports = router;

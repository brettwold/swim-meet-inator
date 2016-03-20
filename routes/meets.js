var express = require('express');
var router = express.Router();

var models = require('../models');
console.log(__dirname);

/* GET meets listing. */
router.get('/', function(req, res, next) {

  Meets
    .findAndCountAll({
       offset: 0,
       limit: 10
    })
    .then(function(result) {
      console.log(result.count);
      console.log(result.rows);
      res.json(result);
    });
});

module.exports = router;

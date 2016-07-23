var express = require('express');
var router = express.Router();

var swimData = require('../helpers/swimdata');

router.get('/', function(req, res, next) {
  res.json(swimData);
});

module.exports = router;

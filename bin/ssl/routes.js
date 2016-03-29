var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log(req.originalUrl);
  console.log(JSON.stringify(req.params));
  console.log(JSON.stringify(req.query));
  console.log(JSON.stringify(req.body));
  res.json({});
});

module.exports = router;

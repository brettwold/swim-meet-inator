var models  = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	models.meet.findAll({
			include: [ models.event ]
  	}).then(function(meets) {
			res.render('home', {
				title: 'Meets',
				meets: meets
			})
		});
	});

module.exports = router;

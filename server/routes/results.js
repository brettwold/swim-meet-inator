var express = require('express');
var router = express.Router();

var Meet = require('../models').Meet;
var Results = require('../helpers/results');
var path = require('path');
var mkdirp = require('mkdirp');

const BASE_DIR = 'data';
const MEET_RESULT_DIR = 'meet';


router.get('/:meetId', function(req, res, next) {
  var self = this;
  Meet.findById(req.params.meetId).then(function(meet) {
    if (meet) {
      var results = new Results();
      var meetDataDir = path.join(process.cwd(), BASE_DIR, MEET_RESULT_DIR, meet.results_dir);
      mkdirp(meetDataDir, function (err) {
          if (err) {
            console.error(err)
            res.status(404).send('Failed to create meet data directory');
          } else {
            if (meet.multi_session) {
              var response = { sessions: {} };
              for(var i = 0; i < meet.num_sessions; i++) {
                var sessionDir = path.join(meetDataDir, "S" + (i+1));
                results.results(sessionDir, i+1, function(resultData, session) {
                  response.sessions[session] = resultData;
                  if (Object.keys(response.sessions).length == meet.num_sessions) {
                    res.json(response);
                  }
                });
              }
            } else {
              results.results(meetDataDir, 1, function(resultData) {
                res.json({ sessions: { "1": resultData } });
              });
            }
          }
      });
    } else {
      res.status(404).send('Meet not found');
    }
  });
});

module.exports = router;

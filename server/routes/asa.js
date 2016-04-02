var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

var Swimmer = require('../models').Swimmer;
var SwimTime = require('../models').SwimTime;

const BASE_URL = 'https://swimmingresults.org';
const INDIVIDUAL_BEST = '/individualbest/personal_best.php?mode=A&tiref=';

const STROKE_LOOKUP = {
  'Freestyle': 'FS',
  'Breaststroke': 'BR',
  'Backstroke': 'BK',
  'Butterfly': 'BF',
  'Individual': 'IM',
};

function removeBrackets(str) {
  return str.replace(/\(|\)/g,'');
}

function getFirstName(str) {
  return str.split(' ').slice(0, -1).join(' ');
}

function getLastName(str) {
  return str.split(' ').slice(-1).join(' ');
}

function removeExtraWhitespace(str) {
  return str.replace(/\s{2,}/g, ' ').trim();
}

function processName(data, str) {
  namesArr = str.split(" - ");

  if(namesArr.length == 3) {
    name = removeExtraWhitespace(namesArr[0]);
    data.first_name = getFirstName(name);
    data.last_name = getLastName(name);
    data.regno = removeBrackets(namesArr[1]);
    data.club = namesArr[2];
  } else {
    data.last_name = str;
  }
}

function processDistanceAndStroke(data, str) {
  strokeArr = str.split(" ");

  if(strokeArr.length >= 2) {
    data.distance = strokeArr[0];
    data.stroke = STROKE_LOOKUP[strokeArr[1]];
  }
}

router.get('/swimmer/:id', function(req, res, next) {
  url = BASE_URL + INDIVIDUAL_BEST + req.params.id;

  request(url, function(error, response, html) {
    if(!error) {
      var $ = cheerio.load(html);
      var swimmer = {times: []};

      var names = $('.rankingsContent p').first().text();
      processName(swimmer, names);

      $('#rankTable').each(function(rankTableIndex, rankTable) {
        $(rankTable).find('tr').each(function(i, row) {
          var time = SwimTime.build();
          var selectcol = $(row).find('td');

          if(selectcol.eq(0).text() != "") {
            time.course_type = rankTableIndex == 0 ? "LC" : "SC";
            processDistanceAndStroke(time, selectcol.eq(0).text().trim());
            time.source = "ASA";
            time.time_formatted = selectcol.eq(1).text().trim();
            time.fina_points = selectcol.eq(2).text().trim();
            time.date = selectcol.eq(3).text().trim();
            time.meet_name = selectcol.eq(4).text().trim();
            time.venue = selectcol.eq(5).text().trim();
            time.license = selectcol.eq(6).text().trim();
            time.level = selectcol.eq(7).text().trim();
            time.save();
            swimmer.times.push(time);
          }
        });
      });

      Swimmer.find({regno: swimmer.regno, include: [ SwimTime ]}).then(function(storedswimmer) {
        SwimTime.destroy({ where: { swimmer_id: storedswimmer.id }});
        storedswimmer.setSwimTimes(swimmer.times);
      });

      res.json(swimmer);
    }
  });
});

module.exports = router;

var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

const BASE_URL = 'https://swimmingresults.org';
const INDIVIDUAL_BEST = '/individualbest/personal_best.php?mode=A&tiref=';

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
    console.log(JSON.stringify(name.split(' ')));
    data.first_name = getFirstName(name);
    data.last_name = getLastName(name);
    data.id = removeBrackets(namesArr[1]);
    data.club = namesArr[2];
  } else {
    data.last_name = str;
  }
}

router.get('/swimmer/:id', function(req, res, next) {
  url = BASE_URL + INDIVIDUAL_BEST + req.params.id;

  request(url, function(error, response, html) {
    if(!error) {
      var $ = cheerio.load(html);
      var json = { first_name : "", last_name: "", id: "", club: "", times : [] };

      var names = $('.rankingsContent p').first().text();
      processName(json, names);

      $('#rankTable').each(function(rankTableIndex, rankTable) {
        $(rankTable).find('tr').each(function(i, row) {
          var time = {};
          var selectcol = $(row).find('td');

          if(selectcol.eq(0).text() != "") {
            time.course = rankTableIndex == 0 ? "LC" : "SC";
            time.stroke = selectcol.eq(0).text().trim();
            time.time = selectcol.eq(1).text().trim();
            time.fina_points = selectcol.eq(2).text().trim();
            time.date = selectcol.eq(3).text().trim();
            time.meet = selectcol.eq(4).text().trim();
            time.location = selectcol.eq(5).text().trim();
            time.license = selectcol.eq(6).text().trim();
            time.level = selectcol.eq(7).text().trim();
            json.times.push(time);
          }
        });
      });

      res.json(json);
    }
  });
});

module.exports = router;

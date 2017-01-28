import cheerio from 'cheerio';
import request from 'request';
import moment from 'moment';

import SwimData from '../helpers/swimdata';

const Models = require('../models');
const Swimmer = Models.Swimmer;
const SwimTime = Models.SwimTime;

const INCLUDES = [ { model: SwimTime, as: "swim_times" } ]
const BASE_URL = 'https://swimmingresults.org';
const INDIVIDUAL_BEST = '/individualbest/personal_best.php?mode=A&tiref=';
const STROKE_HISTORY = '/individualbest/personal_best_time_date.php?mode=A&tiref='
const ATTR_STOKE_TYPE = '&tstroke='
const ATTR_COURSE_TYPE = '&tcourse='

const STROKE_LOOKUP = {
  'Freestyle': 'FS',
  'Breaststroke': 'BR',
  'Backstroke': 'BK',
  'Butterfly': 'BF',
  'Individual': 'IM',
};

export default class AsaService {
  removeBrackets(str) {
    return str.replace(/\(|\)/g,'');
  }

  getFirstName(str) {
    return str.split(' ').slice(0, -1).join(' ');
  }

  getLastName(str) {
    return str.split(' ').slice(-1).join(' ');
  }

  removeExtraWhitespace(str) {
    return str.replace(/\s{2,}/g, ' ').trim();
  }

  formatDate(str) {
    return moment(str, 'DD/MM/YY').format('YYYY-MM-DD');
  }

  processName(data, str) {
    let namesArr = str.split(" - ");

    if(namesArr.length == 3) {
      let name = this.removeExtraWhitespace(namesArr[0]);
      data.first_name = this.getFirstName(name);
      data.last_name = this.getLastName(name);
      data.regno = this.removeBrackets(namesArr[1]);
      data.club = namesArr[2];
    } else {
      data.last_name = str;
    }
  }

  processDistanceAndStroke(data, str) {
    let strokeArr = str.split(" ");

    if(strokeArr.length >= 2) {
      for(let idx in SwimData.races) {
        let race = SwimData.races[idx];
        if(race.distance == strokeArr[0] &&
          race.stroke == STROKE_LOOKUP[strokeArr[1]] &&
          race.course_type == data.course_type) {
            console.log("Found race: " + race.name);
          data.race_type = idx;
        }
      }
    }
  }

  processBestTimeTables(dom, swimmer) {
    dom('#rankTable').each((rankTableIndex, rankTable) => {
      dom(rankTable).find('tr').each((i, row) => {
        let time = SwimTime.build();
        let selectcol = dom(row).find('td');
        let course_type = "LC";

        if(dom(rankTable).prev('p').text().indexOf('Short') > -1) {
          course_type = "SC";
        }

        if(selectcol.eq(0).text() != "") {
          time.course_type = course_type;
          this.processDistanceAndStroke(time, selectcol.eq(0).text().trim());
          time.source = "ASA";
          time.time_formatted = selectcol.eq(1).text().trim();
          time.fina_points = selectcol.eq(2).text().trim();
          time.date = this.formatDate(selectcol.eq(3).text().trim());
          time.meet_name = selectcol.eq(4).text().trim();
          time.venue = selectcol.eq(5).text().trim();
          time.license = selectcol.eq(6).text().trim();
          time.level = selectcol.eq(7).text().trim();
          time.round = 'U';
          swimmer.times.push(time);
        }
      });
    });
  }

  processAllTimeTables(dom, swimmer) {
    dom('#rankTable').each((rankTableIndex, rankTable) => {
      dom(rankTable).find('tr').each((i, row) => {
        let time = SwimTime.build();
        let selectcol = dom(row).find('td');

        if(selectcol.eq(0).text() != "") {
          time.source = "ASA";
          time.time_formatted = selectcol.eq(0).text().trim();
          time.fina_points = selectcol.eq(1).text().trim();
          time.date = this.formatDate(selectcol.eq(3).text().trim());
          time.meet_name = selectcol.eq(4).text().trim();
          time.venue = selectcol.eq(5).text().trim();
          time.license = selectcol.eq(6).text().trim();
          time.level = selectcol.eq(7).text().trim();
          time.round = selectcol.eq(2).text().trim();
          swimmer.times.push(time);
        }
      });
    });
  }

  getAsaStrokeCode(stroke_type) {
    return SwimData.races[stroke_type].asa_stroke
  }

  getAsaCourseCode(stroke_type) {
    return SwimData.races[stroke_type].asa_course
  }

  lookupTimes(asaregno, strokeid) {
    if(!strokeid) {
      return this.lookupBestTimes(asaregno);
    } else {
      return this.lookupAllTimesForStroke(asaregno, strokeid);
    }
  }

  lookupBestTimes(asaregno) {
    let url = BASE_URL + INDIVIDUAL_BEST + asaregno;
    return new Promise((resolve, reject) => {
      request(url, (error, response, html) => {
        if(!error) {
          let dom = cheerio.load(html);
          let swimmer = {times: []};

          let names = dom('.rankingsContent p').first().text();
          this.processName(swimmer, names);

          this.processBestTimeTables(dom, swimmer);

          Swimmer.find({where: {regno: swimmer.regno}, include: INCLUDES }).then((storedswimmer) => {
            if(!storedswimmer) {
              storedswimmer = Swimmer.build(swimmer);
              storedswimmer.save();
            }

            for(let sTime in swimmer.times) {
              swimmer.times[sTime].swimmer_id = storedswimmer.id;
              SwimTime.upsert(swimmer.times[sTime].get());
            }

            resolve(storedswimmer);
          }).catch(function(err) {
            console.log(err);
            reject('Failed to create swimmer');
          });
        } else {
          reject(error);
          console.log("Failed to get data from ASA: " + response);
          console.log(error);
        }
      });
    });
  }

  lookupAllTimesForStroke(asaregno, strokeid) {
    let stroke = this.getAsaStrokeCode(strokeid);
    let course = this.getAsaCourseCode(strokeid);

    let url = BASE_URL + STROKE_HISTORY + asaregno + ATTR_STOKE_TYPE + stroke + ATTR_COURSE_TYPE + course;

    return new Promise((resolve, reject) => {
      request(url, (error, response, html) => {
        if(!error) {
          let dom = cheerio.load(html);
          let swimmer = {times: []};

          this.processAllTimeTables(dom, swimmer);

          Swimmer.find({where: {regno: asaregno}, include: INCLUDES }).then((storedswimmer) => {
            for(sTime in swimmer.times) {
              swimmer.times[sTime].swimmer_id = storedswimmer.id;
              swimmer.times[sTime].race_type = req.params.stroke;
              SwimTime.upsert(swimmer.times[sTime].get());
            }
          });
          resolve(swimmer);
        } else {
          reject(error);
          console.log("Failed to get data from ASA: " + response);
          console.log(error);
        }
      });
    });
  }

}

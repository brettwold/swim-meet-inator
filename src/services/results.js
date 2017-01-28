import path from 'path';
import mkdirp  from 'mkdirp';

import Results from '../helpers/results';

const BASE_DIR = 'data';
const MEET_RESULT_DIR = 'meet';

const Models = require('../models');
const Meet = Models.Meet;

export default class ResultsService {

  getResultsForMeet(meet_id) {
    return new Promise((resolve, reject) => {
      Meet.findById(meet_id).then((meet) => {
        if (meet) {
          var results = new Results();
          var meetDataDir = path.join(process.cwd(), BASE_DIR, MEET_RESULT_DIR, meet.results_dir);
          mkdirp(meetDataDir, (err) => {
              if (err) {
                console.error(err)
                reject('Failed to create meet data directory');
              } else {
                if (meet.multi_session) {
                  var response = { sessions: {} };
                  for(let i = 0; i < meet.num_sessions; i++) {
                    var sessionDir = path.join(meetDataDir, "S" + (i+1));
                    results.results(sessionDir, i+1, (resultData, session) => {
                      response.sessions[session] = resultData;
                      if (Object.keys(response.sessions).length == meet.num_sessions) {
                        resolve(response);
                      }
                    });
                  }
                } else {
                  results.results(meetDataDir, 1, (resultData) => {
                    resolve({ sessions: { "1": resultData } });
                  });
                }
              }
          });
        } else {
          reject('Meet not found');
        }
      });
    });
  }
}

import path from 'path';
import ObjectService from './objectservice';
import ClubImport from '../helpers/clubimport';

const Models = require('../models');
const Club = Models.Club;
const clubImport = new ClubImport();

const BASE_DIR = 'data';

export default class ClubsService extends ObjectService {

  constructor() {
    super(Club);
  }

  save(object) {
    const payload = {
      id: object.id,
      // TODO filter club fields here
    };

    return super.doSave(object);
  }

  findByMeetName(meet_name) {
    return super.find({ where: { meet_name: meet_name }});
  }

  importClubs() {
    var clubDataDir = path.join(process.cwd(), BASE_DIR);
    console.log(clubDataDir);

    clubImport.importClubs(clubDataDir).then((clubs) => {

      let clubData = [];
      for(let club of clubs) {
        if(club[1] != "Code") {
          let payload = {
            name: club[0],
            code: club[1],
            district: club[2],
            county: club[3],
            meet_name: club[4]
          };
          clubData.push(payload);
        }
      }

      Club.bulkCreate(clubData, { validate: true }).catch(function(errors) {
        console.log(errors);
      });
    });
  }
}

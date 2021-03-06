import ObjectService from './objectservice';
import SwimmersService from './swimmers';
import ClubsService from './clubs';

const swimmersService = new SwimmersService();
const clubService = new ClubsService();

const Models = require('../models');
const Meet = Models.Meet;
const Entry = Models.Entry;
const Swimmer = Models.Swimmer;
const SwimTime = Models.SwimTime;

var INCLUDES = [
  { model: Swimmer, as: 'swimmer' }
];

export default class EntriesService extends ObjectService {

  constructor() {
    super(Entry, INCLUDES);
  }

  save(object) {
    const payload = {
      id: object.id,
      entry_date: object.entry_date,
      entries: object.entries,
      special_notes: object.special_notes,
      cost_per_race: object.cost_per_race,
      admin_fee: object.admin_fee,
      total_cost: object.total_cost,
      paid: object.paid,
      paid_date: object.paid_date,
      payment_method: object.payment_method
    };

    return super.doSave(object);
  }

  findByMeet(page, pagesize, meet_id) {
    return super.findAll(page, pagesize, { meet_id: meet_id });
  }

  saveCheckSwimmerAndCreateEntry(entry) {
    return new Promise((resolve, reject) => {
      if(entry) {
        let putSwimmer = entry.swimmer;
        if(putSwimmer) {
          Swimmer.findOrCreate({ defaults: putSwimmer, where: { regno: putSwimmer.regno }}).spread((swimmer, created) => {
            console.log("Got swimmer: " + swimmer);
            for(let sTime in putSwimmer.times) {
              putSwimmer.times[sTime].swimmer_id = swimmer.id;
              SwimTime.upsert(putSwimmer.times[sTime]);
            }
            entry.entry_date = new Date();
            super.doSave(entry).then((entry) => {
              entry.setSwimmer(swimmer);
              resolve(entry);
            });
          });
        }
      } else {
        reject("No entry data")
      }
    });
  }
}

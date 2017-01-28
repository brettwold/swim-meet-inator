import ObjectService from './objectservice';

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
}

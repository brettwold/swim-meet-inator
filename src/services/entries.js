import ObjectService from './objectservice';

const Models = require('../models');
const Meet = Models.Meet;
const Entry = Models.Entry;
const Swimmer = Models.Swimmer;
const SwimTime = Models.SwimTime;

var INCLUDES = [
  { model: Swimmer, as: 'swimmer' },
  { model: SwimTime, through: 'entrytime', as: 'entrytimes' }
];

export default class EntriesService extends ObjectService {

  constructor() {
    super(Entry, INCLUDES);
  }

  save(object) {
    const payload = {
      id: object.id,
      race_types: object.race_types,
      special_notes: object.special_notes,
      cost_per_race: object.cost_per_race,
      admin_fee: object.admin_fee,
      payment_total: object.payment_total,
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

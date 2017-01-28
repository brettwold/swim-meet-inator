import ObjectService from './objectservice';

const Models = require('../models');
const Meet = Models.Meet;
const Timesheet = Models.Timesheet;

var INCLUDES = [
  { model: Timesheet, as: 'minimum_timesheet' },
  { model: Timesheet, as: 'maximum_timesheet' },
  { model: Timesheet, as: 'auto_timesheet' }
];

export default class MeetsService extends ObjectService {

  constructor() {
    super(Meet, INCLUDES);
  }

  save(object) {
    const payload = {
      id: object.id,
      // TODO filter meet fields here
    };

    return super.doSave(object);
  }

  current() {
    return super.findAll(1, 50, { is_complete: 0 });
  }
}

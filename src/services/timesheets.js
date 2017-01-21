import ObjectService from './objectservice';

const Models = require('../models');
const Timesheet = Models.Timesheet;

export default class TimesheetsService extends ObjectService {

  constructor() {
    super(Timesheet);
  }

  save(object) {
    const payload = {
      id: object.id,
      // TODO filter timesheet fields here
    };

    return super.doSave(object);
  }

}

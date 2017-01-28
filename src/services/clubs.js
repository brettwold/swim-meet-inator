import ObjectService from './objectservice';

const Models = require('../models');
const Club = Models.Club;

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

}

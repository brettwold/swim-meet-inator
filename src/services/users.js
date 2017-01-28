import ObjectService from './objectservice';

const Models = require('../models');
const User = Models.User;

export default class UsersService extends ObjectService {

  constructor() {
    super(User);
  }

  save(object) {

    const payload = {
      id: object.id,
      first_name: object.first_name,
      last_name: object.last_name,
      address_line_1: object.address_line_1,
      address_line_2: object.address_line_2,
      town: object.town,
      county: object.county,
      post_code: object.post_code,
      telephone_no: object.telephone_no,
      email: object.email,
      photo: object.photo,
      special_notes: object.special_notes,
      role: object.role,
      google_id: object.google_id
    };

    return super.doSave(payload);
  }
}

import ObjectService from './objectservice';
import sequelize from 'sequelize';

const Models = require('../models');
const Swimmer = Models.Swimmer;
const SwimTime = Models.SwimTime;

var INCLUDES = [{
  model: SwimTime, as: "swim_times"
}];

export default class SwimmersService extends ObjectService {

  constructor() {
    super(Swimmer, INCLUDES);
  }

  save(object) {

    const payload = {
      id: object.id,
      first_name: object.first_name,
      last_name: object.last_name,
      club: object.club,
      dob: object.dob,
      gender: object.gender,
      address_line_1: object.address_line_1,
      address_line_2: object.address_line_2,
      town: object.town,
      county: object.county,
      post_code: object.post_code,
      telephone_no: object.telephone_no,
      email: object.email,
      regno: object.regno,
      special_notes: object.special_notes
    };

    return super.doSave(payload);
  }

  findByRegno(regno) {
    return Swimmer.find({where: {regno: regno}}, {
      include: INCLUDES,
      order: [ 'race_type', sequelize.fn('min', sequelize.col('time')) ],
      group: ['race_type']
    })
  }
}

import ObjectService from './objectservice';
import sequelize from 'sequelize';

const Models = require('../models');
const Swimmer = Models.Swimmer;
const SwimTime = Models.SwimTime;


export default class SwimtimesService extends ObjectService {
  constructor() {
    super(SwimTime);
  }

  getBest(swimmer_id, qual_date) {
    if(!qual_date) {
      return super.findAll(1, 10000, { swimmer_id: swimmer_id }, [ 'race_type' ], 'race_type' );
    } else {
      return super.findAll(1, 10000, {
            swimmer_id: swimmer_id,
            date: {
              $gt: new Date(qual_date)
            }
          },
          [ 'race_type' ], 'race_type' );
    }
  }

  getAll(swimmer_id, race_type) {
    if(!race_type) {
      return super.findAll(1, 10000, { swimmer_id: swimmer_id }, ['race_type']);
    } else {
      return super.findAll(1, 10000, { swimmer_id: swimmer_id, race_type: race_type }, ['time']);
    }
  }
}

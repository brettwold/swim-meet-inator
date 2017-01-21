import ModelController from './modelcontroller';
import Models from '../models';
import MeetsService from '../services/meets';

const meetsService = new MeetsService();
const DEFAULT_PAGE_SIZE = 20;

export default class MeetsController extends ModelController {
  constructor() {
    super(meetsService, '/meets', 'meet', 'meets', DEFAULT_PAGE_SIZE, 'meet_id');
  }

  current(req, res) {
    Meet.findAll({
      where: {
        is_complete: 0
      },
      offset: 0,
      limit: 10,
      include: INCLUDES,
      order: [['meet_date', 'DESC']]
    }).then((result) => {
      res.json(result);
    });
  }
}

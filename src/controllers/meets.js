import ModelController from './modelcontroller';
import MeetsService from '../services/meets';

const meetsService = new MeetsService();
const DEFAULT_PAGE_SIZE = 20;

export default class MeetsController extends ModelController {
  constructor() {
    super(meetsService, '/meets', 'meet', 'meets', DEFAULT_PAGE_SIZE, 'meet_id');
  }

  current(req, res) {
    meetsService.current().then((objects) => {
      res.json(super.getListViewData(req.user, 1, objects));
    }).catch((error) => {
      console.log('Failed to get current meets', error);
      res.status(403).json({
        status: 'FAILED',
        message: error.message,
        error: error.stack
      });
    });
  }
}

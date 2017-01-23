import ModelController from './modelcontroller';
import SwimmersService from '../services/swimmers';

const DEFAULT_PAGE_SIZE = 20;
const swimmersService = new SwimmersService();

export default class SwimmersController extends ModelController {
  constructor() {
    super(swimmersService, '/swimmers', 'swimmer', 'swimmers', DEFAULT_PAGE_SIZE, 'swimmer_id');
  }

  findByRegno(req, res) {
    swimmersService.findByRegno(req.params.regno).then(function(swimmer) {
      if(swimmer) {
        res.json(swimmer);
      } else {
        res.status(404).json({
          status: 'FAILED',
          message: 'Failed to find swimmer'
        });
      }
    }).catch((error) => {
      console.log('Failed to get swimmer', error);
      res.status(403).json({
        status: 'FAILED',
        message: error.message,
        error: error.stack
      });
    });
  }
}

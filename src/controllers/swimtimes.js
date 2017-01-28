import ModelController from './modelcontroller';
import SwimtimesService from '../services/swimtimes';

const swimtimesService = new SwimtimesService();

export default class SwimtimesController {
  getBest(req, res) {
    swimtimesService.getBest(req.params.swimmerid, req.params.qualdate).then((response) => {
      res.json(response);
    }).catch((error) => {
      console.log('Failed to get swimtimes', error);
      res.status(403).json({
        status: 'FAILED',
        message: error.message,
        error: error.stack
      });
    });
  }

  getAll(req, res) {
    swimtimesService.getAll(req.params.swimmerid, req.params.racetype).then((response) => {
      res.json(response);
    }).catch((error) => {
      console.log('Failed to get swimtimes', error);
      res.status(403).json({
        status: 'FAILED',
        message: error.message,
        error: error.stack
      });
    });
  }
}

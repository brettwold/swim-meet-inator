import ModelController from './modelcontroller';
import AsaService from '../services/asa';

const asaService = new AsaService();

export default class AsaController {
  lookupTimes(req, res) {
    asaService.lookupTimes(req.params.swimmer_id, req.params.stroke).then((response) => {
      res.json(response);
    }).catch((error) => {
      console.log('Failed to get swimmer times', error);
      res.status(403).json({
        status: 'FAILED',
        message: error.message,
        error: error.stack
      });
    });
  }
}

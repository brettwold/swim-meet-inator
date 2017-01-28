import ModelController from './modelcontroller';
import ResultsService from '../services/results';

const resultsService = new ResultsService();

export default class ResultsController {
  results(req, res) {
    resultsService.getResultsForMeet(req.params.meet_id).then((response) => {
      res.json(response);
    }).catch((error) => {
      console.log('Failed to get results', error);
      res.status(403).json({
        status: 'FAILED',
        message: error.message,
        error: error.stack
      });
    });
  }
}

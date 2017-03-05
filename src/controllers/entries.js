import ModelController from './modelcontroller';
import EntriesService from '../services/entries';

const entriesService = new EntriesService();
const DEFAULT_PAGE_SIZE = 20;

export default class EntriesController extends ModelController {
  constructor() {
    super(entriesService, '/entries', 'entry', 'entries', DEFAULT_PAGE_SIZE, 'id');
  }

  save(req, res) {
    console.log(req.body);
    entriesService.saveCheckSwimmerAndCreateEntry(req.body.entry).then((response) => {
      res.json({ status: 'OK', entry: response });
    }).catch((error) => {
      console.log('Failed to save entry for meet', error);
      res.status(403).json({
        status: 'FAILED',
        message: error.message,
        error: error.stack
      });
    });
  }

  findByMeet(req, res) {
    let page = 1;
    if(req.params.page) {
      page = parseInt(req.params.page);
    }

    entriesService.findByMeet((page-1)*this.pagesize, this.pagesize, req.params.meet_id).then((objects) => {
      res.json(super.getListViewData(req.user, 1, objects));
    }).catch((error) => {
      console.log('Failed to get entries for meet', error);
      res.status(403).json({
        status: 'FAILED',
        message: error.message,
        error: error.stack
      });
    });
  }
}

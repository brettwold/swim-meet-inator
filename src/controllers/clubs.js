import ModelController from './modelcontroller';
import Models from '../models';
import ClubsService from '../services/clubs';

const clubsService = new ClubsService();
const Swimmer = Models.Swimmer;
const DEFAULT_PAGE_SIZE = 20;

export default class ClubsController extends ModelController {
  constructor() {
    super(clubsService, '/clubs', 'club', 'clubs', DEFAULT_PAGE_SIZE, 'id');
  }

  swimmers(req, res) {
    Swimmer.findAndCountAll({
      offset: 0,
      limit: 10,
      where: { club_id: req.params.id }
    })
    .then(function(result) {
      res.json(result);
    });
  }

  importClubs(req, res) {
    clubsService.importClubs();
    res.json({});
  }
}

import express from 'express';
import MeetsController from '../controllers/meets';
import TimesheetsController from '../controllers/timesheets';
import ClubsController from '../controllers/clubs';
import SwimmersController from '../controllers/swimmers';
import EntriesController from '../controllers/entries';
import UsersController from '../controllers/users';
import SwimData from '../helpers/swimdata';
import auth from '../helpers/authorisation';

const meetsController = new MeetsController();
const timesheetController = new TimesheetsController();
const clubsController = new ClubsController();
const usersController = new UsersController();
const swimmersController = new SwimmersController();
const entriesController = new EntriesController();

const router = express.Router();

router.get('/', (req, res) => {
    if(req.isAuthenticated()) {
      res.send(req.user);
    } else {
      res.sendStatus(401);
    }
  });

router.get('/swimdata', (req, res) => { res.json(SwimData); });

router.get('/meets', (req, res) => { meetsController.get(req, res) });
router.get('/meets/current',  (req, res) => { meetsController.current(req, res) });
router.get('/meets/:id',  (req, res) => { meetsController.find(req, res) });
router.put('/meets/save', (req, res) => { meetsController.save(req, res) });
router.get('/meets/delete/:id', (req, res) => { meetsController.delete(req, res) });

router.get('/timesheets', (req, res) => { timesheetController.get(req, res) });
router.get('/timesheets/:id',  (req, res) => { timesheetController.edit(req, res) });
router.put('/timesheets/save', (req, res) => { timesheetController.save(req, res) });
router.get('/timesheets/delete/:id', (req, res) => { timesheetController.delete(req, res) });

router.get('/clubs', (req, res) => { clubsController.get(req, res) });
router.get('/clubs/:id', (req, res) => { clubsController.edit(req, res) });
router.get('/clubs/:id/swimmers', (req, res) => { clubsController.swimmers(req, res) });
router.put('/clubs/save', (req, res) => { clubsController.save(req, res) });
router.post('/addswimmer', (req, res) => { clubsController.addSwimmer(req, res) });
router.post('/deleteswimmer', (req, res) => { clubsController.deleteSwimmer(req, res) });
router.get('/delete/:id', (req, res) => { clubsController.delete(req, res) });

router.get('/swimmers', (req, res) => { swimmersController.get(req, res) });
router.get('/swimmers/:id',  (req, res) => { swimmersController.edit(req, res) });
router.put('/swimmers/save', (req, res) => { swimmersController.save(req, res) });
router.get('/swimmers/delete/:id', (req, res) => { swimmersController.delete(req, res) });
router.get('/swimmers/regno/:regno', (req, res) => { swimmersController.findByRegno(req, res) });

router.get('/entries', (req, res) => { entriesController.get(req, res) });
router.get('/entries/:id',  (req, res) => { entriesController.edit(req, res) });
router.put('/entries/save', (req, res) => { entriesController.save(req, res) });
router.get('/entries/delete/:id', (req, res) => { entriesController.delete(req, res) });
router.get('/entries/meet/:meet_id', (req, res) => { entriesController.findByMeet(req, res) });

router.get('/users', (req, res) => { usersController.get(req, res) });
router.get('/users/:id',  (req, res) => { usersController.edit(req, res) });
router.put('/users/save', (req, res) => { usersController.save(req, res) });
router.get('/users/delete/:id', (req, res) => { usersController.delete(req, res) });

module.exports = router;

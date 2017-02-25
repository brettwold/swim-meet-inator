import express from 'express';
import AuthenticationController from '../controllers/authentication';
import MeetsController from '../controllers/meets';
import TimesheetsController from '../controllers/timesheets';
import ClubsController from '../controllers/clubs';
import SwimmersController from '../controllers/swimmers';
import SwimtimesController from '../controllers/swimtimes';
import EntriesController from '../controllers/entries';
import UsersController from '../controllers/users';
import MembersController from '../controllers/members';
import ResultsController from '../controllers/results';
import AsaController from '../controllers/asa';
import SwimData from '../helpers/swimdata';
import AuthService from '../services/authorise';

const authenticationController = new AuthenticationController();
const meetsController = new MeetsController();
const timesheetController = new TimesheetsController();
const clubsController = new ClubsController();
const usersController = new UsersController();
const membersController = new MembersController();
const swimmersController = new SwimmersController();
const swimtimesController = new SwimtimesController();
const entriesController = new EntriesController();
const resultsController = new ResultsController();
const asaController = new AsaController();

const router = express.Router();

let auth = new AuthService();

router.get('/', function(req, res) { res.json({message: 'SwimResultinator API: ' + process.env.npm_package_version}); });
router.post('/authenticate', function(req, res) { authenticationController.authenticate(req, res); });
router.get('/swimdata', (req, res) => { res.json(SwimData); });

// External api URIs to be called from application
router.put('/members/signup', auth.isAuthApi, (req, res) => { membersController.signup(req, res) });

router.get('/meets', auth.isAuthApi, (req, res) => { meetsController.get(req, res) });
router.get('/meets/current', auth.isAuthApi, (req, res) => { meetsController.current(req, res) });
router.get('/meets/:id', auth.isAuthApi, (req, res) => { meetsController.edit(req, res) });

router.get('/entries', auth.isAuthApi, (req, res) => { entriesController.get(req, res) });
router.get('/entries/:id', auth.isAuthApi, (req, res) => { entriesController.edit(req, res) });
router.put('/entries/save', auth.isAuthApi, (req, res) => { entriesController.save(req, res) });

// Internal/Admin only URIs to be called from admin portal
router.put('/meets/save', auth.isAdmin, (req, res) => { meetsController.save(req, res) });
router.get('/meets/delete/:id', auth.isAdmin, (req, res) => { meetsController.delete(req, res) });

router.get('/timesheets', auth.isAdmin, (req, res) => { timesheetController.get(req, res) });
router.get('/timesheets/:id',  auth.isAdmin, (req, res) => { timesheetController.edit(req, res) });
router.put('/timesheets/save', auth.isAdmin, (req, res) => { timesheetController.save(req, res) });
router.get('/timesheets/delete/:id', auth.isAdmin, (req, res) => { timesheetController.delete(req, res) });

router.get('/clubs', auth.isAdmin, (req, res) => { clubsController.get(req, res) });
router.get('/clubs/:id', auth.isAdmin, (req, res) => { clubsController.edit(req, res) });
router.get('/clubs/:id/swimmers', auth.isAdmin, (req, res) => { clubsController.swimmers(req, res) });
router.put('/clubs/save', auth.isAdmin, (req, res) => { clubsController.save(req, res) });
router.get('/clubs/delete/:id', auth.isAdmin, (req, res) => { clubsController.delete(req, res) });

router.get('/swimmers', auth.isAdmin, (req, res) => { swimmersController.get(req, res) });
router.get('/swimmers/:id', auth.isAdmin, (req, res) => { swimmersController.edit(req, res) });
router.put('/swimmers/save', auth.isAdmin, (req, res) => { swimmersController.save(req, res) });
router.get('/swimmers/delete/:id', auth.isAdmin, (req, res) => { swimmersController.delete(req, res) });
router.get('/swimmers/regno/:regno', auth.isAdmin, (req, res) => { swimmersController.findByRegno(req, res) });

router.get('/swimtimes/best/:swimmerid', auth.isAdmin, (req, res) => { swimtimesController.getBest(req, res) });
router.get('/swimtimes/best/:swimmerid/:qualdate', auth.isAdmin, (req, res) => { swimtimesController.getBest(req, res) });
router.get('/swimtimes/:swimmerid/:racetype', auth.isAdmin, (req, res) => { swimtimesController.getAll(req, res) });
router.get('/swimtimes/:swimmerid', auth.isAdmin, (req, res) => { swimtimesController.getAll(req, res) });

router.get('/entries/delete/:id', auth.isAdmin, (req, res) => { entriesController.delete(req, res) });
router.get('/entries/meet/:meet_id', auth.isAdmin, (req, res) => { entriesController.findByMeet(req, res) });

router.get('/users', auth.isAdmin, (req, res) => { usersController.get(req, res) });
router.get('/users/:id', auth.isAdmin, (req, res) => { usersController.edit(req, res) });
router.put('/users/save', auth.isAdmin, (req, res) => { usersController.save(req, res) });
router.get('/users/delete/:id', auth.isAdmin, (req, res) => { usersController.delete(req, res) });

router.get('/results/:meet_id', auth.isAdmin, (req, res) => { resultsController.results(req, res) });

router.get('/asa/swimmer/:swimmer_id', auth.isAdmin, (req, res) => { asaController.lookupTimes(req, res); });
router.get('/asa/swimmer/:swimmer_id/:stroke', auth.isAdmin, (req, res) => { asaController.lookupTimes(req, res); });

module.exports = router;

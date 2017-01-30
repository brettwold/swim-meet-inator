import ModelController from './modelcontroller';
import TimesheetService from '../services/timesheets';

const DEFAULT_PAGE_SIZE = 20;
const timesheetService = new TimesheetService();

export default class TimesheetsController extends ModelController {
  constructor() {
    super(timesheetService, '/timesheets', 'timesheet', 'timesheets', DEFAULT_PAGE_SIZE, 'id');
  }
}

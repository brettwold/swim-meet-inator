import ModelController from './modelcontroller';
import UsersService from '../services/users';
import HttpStatus from 'http-status-codes';

const DEFAULT_PAGE_SIZE = 20;
const usersService = new UsersService();

export default class MembersController {
  constructor() {

  }

  signup(req, res) {
    console.log(req.body);
    usersService.createMember(req.body).then((member) => {
      if(member) {
        let viewData = { status: 'OK', member: member };
        res.json(viewData);
      } else {
        console.log('Failed to save member');
        res.status(HttpStatus.NOT_ACCEPTABLE).json(this.getErrorResponse({ message: 'Failed to save member' }));
      }
    }).catch((error) => {
      console.log('Failed to save member, err', error);
      res.status(HttpStatus.NOT_ACCEPTABLE).json(this.getErrorResponse(error));
    });
  }

  getErrorResponse(error) {
    return {
      status: 'FAILED',
      message: error ? error.message : "",
      error: error ? error.stack : ""
    };
  }
}

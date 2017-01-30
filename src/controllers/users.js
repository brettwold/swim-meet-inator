import ModelController from './modelcontroller';
import UsersService from '../services/users';

const DEFAULT_PAGE_SIZE = 20;
const usersService = new UsersService();

export default class UsersController extends ModelController {
  constructor() {
    super(usersService, '/users', 'user', 'users', DEFAULT_PAGE_SIZE, 'id');
  }
}

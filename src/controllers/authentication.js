import UserService from '../services/users';
const userService = new UserService();

const Models = require('../models');
const User = Models.User;

export default class AuthenticationController {
  authenticate (req, res) {
    let key = req.body.access_key_id;
    if(key) {
      console.log(key);
      User.find({ where: { access_key_id: key } }).then((user) => {
        if(user) {
          if(user.access_key_secret == req.body.access_key_secret) {
            res.json({ success: true, access_token: userService.getToken(user) });
          }
        } else {
          res.status(404).json({ success: false, message: 'Authentication failed. Consumer not found' });
        }
      }).catch((err) => {
        console.log(err);
        res.status(404).json({ success: false, message: 'Authentication failed' });
      });
    } else {
      res.status(404).json({ success: false, message: 'Authentication failed. Invalid token request.' });
    }
  }
}

import ObjectService from './objectservice';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import uuid from 'uuid';

const Models = require('../models');
const User = Models.User;
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'changemeforproduction';
const DEFAULT_EXP_TIME = 1440*60; // expires in 24 hours

export default class UsersService extends ObjectService {

  constructor() {
    super(User);
  }

  save(object) {

    const payload = {
      id: object.id,
      first_name: object.first_name,
      last_name: object.last_name,
      address_line_1: object.address_line_1,
      address_line_2: object.address_line_2,
      town: object.town,
      county: object.county,
      post_code: object.post_code,
      telephone_no: object.telephone_no,
      email: object.email,
      photo: object.photo,
      special_notes: object.special_notes,
      role: object.role,
      google_id: object.google_id,
      access_key_id: object.access_key_id,
      access_key_secret: object.access_key_secret
    };

    return super.doSave(payload);
  }

  getToken(user) {
    let jwtData = { id: user.id,
      name: user.last_name,
      access_key_id: user.access_key_id,
      access_key_secret: user.access_key_secret
    }
    return jwt.sign(jwtData, TOKEN_SECRET, { expiresIn: DEFAULT_EXP_TIME });
  }

  generateSecret(length, symbols) {
    let bytes = crypto.randomBytes(length || 64);
    let set = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    if (symbols) {
      set += '!@#$%^&*()<>?/[]{},.:;';
    }

    let output = '';
    for (let i = 0, l = bytes.length; i < l; i++) {
      output += set[Math.floor(bytes[i] / 255.0 * (set.length - 1))];
    }
    return output;
  }

  generateId() {
    return uuid.v4();
  }
}

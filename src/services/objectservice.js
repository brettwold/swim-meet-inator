const Promise = require('promise');

export default class ObjectService {

  constructor(objectType, includes) {
    this.objectType = objectType;
    this.includes = includes;
  }

  doSave(objectData) {
    if(!objectData.id) {
      let obj = this.objectType.build(objectData);
      return obj.save();
    } else {
      return this.objectType.findById(objectData.id).then((obj) => {
        return obj.updateAttributes(objectData);
      });
    }
  }

  find(objId) {
    return this.objectType.find({ where: { id: objId }, include: this.includes });
  }

  findAll(page, pagesize, where, order, group) {
    if(!where) {
      where = {};
    }
    let options = {};
    let result = {};

    if(!order) {
      order = [['created_at', 'desc']];
    }

    if(page && pagesize) {
      let limit = pagesize ? parseInt(pagesize) : 20;
      let offset = (page ? parseInt(page)-1 : 0) * limit;
      options = { where: where, offset: offset, limit: limit, order: order };
      result.offset = offset;
      result.limit = limit;
    } else {
      options = { where: where, order: order };
    }

    if(this.includes) {
      options.include = this.includes;
    }

    if(group) {
      options.group = group;
    }

    return new Promise((resolve, reject) => {
      this.objectType.findAndCountAll(options).then((data) => {
        result.rows = data.rows;
        if(group && data.count) {
          result.count = data.count.length;
        } else {
          result.count = data.count;
        }
        resolve(result);
      }).catch(error => {
        reject(error);
      });
    });
  }

  delete(objId) {
    return new Promise((resolve, reject) => {
      this.objectType.findById(objId).then((object) => {
        if(object) {
          object.destroy({ force: true }).then(() => resolve(object));
        } else {
          reject("Not found: " + objId);
        }
      }).catch(error => {
        reject(error);
      });
    });
  }
}

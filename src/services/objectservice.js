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
    return this.objectType.find({ where: { id: objId, include: this.includes }});
  }

  findAll(page, pagesize, where) {
    if(!where) {
      where = {};
    }
    let options = {};
    let result = {};
    let order = [['created_at', 'desc']];

    if(page && pagesize) {
      let limit = pagesize ? parseInt(pagesize) : 20;
      let offset = (page ? parseInt(page)-1 : 0) * limit;
      options = { where: where, offset: offset, limit: limit, order: order, include: this.includes };
      result.offset = offset;
      result.limit = limit;
    } else {
      options = { where: where, order: order, include: this.includes };
    }

    return new Promise((resolve, reject) => {
      this.objectType.findAndCountAll(options).then((data) => {
        result.rows = data.rows;
        result.count = data.count;
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
          object.destroy({ force: true })
        }
        resolve(object);
      }).catch(error => {
        reject(error);
      });
    });
  }
}

import HttpStatus from 'http-status-codes';

export default class ModelController {

  constructor(modelService, prefixUrl, singularName, pluralName, pagesize, paramIdKey) {
    this.modelService = modelService;
    this.prefixUrl = prefixUrl;
    this.singularName = singularName;
    this.pluralName = pluralName;
    this.pagesize = pagesize;
    this.paramIdKey = paramIdKey;
  }

  get(req, res) {
    let page = 1;
    if(req.params.page) {
      page = parseInt(req.params.page);
    }

    this.modelService.findAll((page-1)*this.pagesize, this.pagesize).then((objects) => {
      res.json(this.getListViewData(req.user, page, objects));
    }).catch((error) => {
      console.log(error);
      res.status(HttpStatus.NOT_FOUND).json(this.getErrorResponse(error));
    });
  }

  getListViewData(user, page, objects) {
    let pageinfo;
    let pages = Math.ceil(objects.count/this.pagesize);
    if(objects.count > 0) {
      pageinfo = { urlprefix: this.prefixUrl, page: page, pagesize: this.pagesize, pages: pages };
    }
    let viewData = { user: user, pageinfo: pageinfo };
    viewData[this.pluralName] = objects.rows;
    return viewData;
  }

  edit(req, res, extras) {
    console.log("req.params[this.paramIdKey]" + req.params[this.paramIdKey]);
    this.modelService.find(req.params[this.paramIdKey]).then((object) => {
      if(object) {
        let viewData = { user: req.user };
        viewData = Object.assign(viewData, extras);
        viewData[this.singularName] = object;
        res.json(viewData);
      } else {
        res.status(HttpStatus.NOT_FOUND).json(this.getErrorResponse({ message: "Failed to find " + this.singularName }));
      }
    }).catch((error) => {
      console.log('Failed to find ' + this.singularName, error);
      res.status(HttpStatus.NOT_FOUND).json(this.getErrorResponse(error));
    });
  }

  delete(req, res) {
    this.modelService.delete(req.params[this.paramIdKey]).then(() => {
      res.json({ status: 'OK' });
    }).catch((error) => {
      console.log('Failed to delete ' + this.singularName, error);
      res.status(HttpStatus.NOT_FOUND).json(this.getErrorResponse(error));
    });
  }

  save(req, res) {
    this.modelService.save(req.body).then((object) => {
      if(object) {
        let viewData = { status: 'OK' };
        viewData[this.singularName] = object;
        res.json(viewData);
      } else {
        console.log('Failed to save ' + this.singularName);
        res.status(HttpStatus.NOT_ACCEPTABLE).json(this.getErrorResponse({ message: 'Failed to save '+ this.singularName }));
      }
    }).catch((error) => {
      console.log('Failed to save ' + this.singularName, error);
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

module.exports = {
  "development": {
    "username": "root",
    "password": null,
    "database": "main",
    "storage": "data/swim.db",
    "dialect": "sqlite",
    "omitNull": true,
  	"define": {
  	    "underscored": true,
  	    "timestamps": true
  	}
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
  	"define": {
  	    "underscored": true,
  	    "timestamps": true
  	}
  },
  "production": {
    "username": "yyyyy",
    "password": "xxxx",
    "database": "ebdb",
    "host": "xxx.rds.amazonaws.com",
    "dialect": "mysql",
  	"define": {
  	    "underscored": true,
  	    "timestamps": true
  	}
  }
};

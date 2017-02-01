"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address_line_1: DataTypes.STRING,
    address_line_2: DataTypes.STRING,
    town: DataTypes.STRING,
    county: DataTypes.STRING,
    post_code: DataTypes.STRING(10),
    telephone_no: DataTypes.STRING(17),
    email: DataTypes.STRING,
    photo: DataTypes.STRING,
    special_notes: DataTypes.TEXT,
    role: {
      type: DataTypes.ENUM('user', 'admin', 'superadmin'),
      defaultValue: 'user'
    },
    google_id: DataTypes.STRING,
    access_key_id: DataTypes.STRING,
    access_key_secret: DataTypes.STRING
  }, {
    classMethods: {
    	associate: function(models) {
        User.belongsToMany(models.Swimmer, {through: 'UserSwimmers'});
    	}
    },
    getterMethods: {
      full_name: function() {
        return this.getDataValue('first_name') + ' ' + this.getDataValue('last_name');
      }
    }
  });

  return User;
};

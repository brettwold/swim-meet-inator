


module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  grunt.registerTask('sync', 'Synchronise DB', function() {
    var done = this.async();

    var db = require(__dirname + '/server/models');
    db.sequelize.sync();
  });

  grunt.loadNpmTasks('grunt-browserify');
};

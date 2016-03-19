global.$ = $;

var remote = require('remote');
var Menu = remote.require('menu');
var BrowserWindow = remote.require('browser-window');
var MenuItem = remote.require('menu-item');
var shell = require('shell');

var Results = require('results');

// append default actions to menu for OSX
var initMenu = function () {
  // try {
  //   var nativeMenuBar = new Menu();
  //   if (process.platform == "darwin") {
  //     nativeMenuBar.createMacBuiltin && nativeMenuBar.createMacBuiltin("FileExplorer");
  //   }
  // } catch (error) {
  //   console.error(error);
  //   setTimeout(function () { throw error }, 1);
  // }
};

var aboutWindow = null;
var App = {
  // show "about" window
  about: function () {
    var params = {toolbar: false, resizable: false, show: true, height: 150, width: 400};
    aboutWindow = new BrowserWindow(params);
    aboutWindow.loadUrl('file://' + __dirname + '/about.html');
  },

  // change folder for sidebar links
  cd: function (anchor) {
    anchor = $(anchor);

    $('#sidebar li').removeClass('active');
    $('#sidebar i').removeClass('icon-white');

    anchor.closest('li').addClass('active');
    anchor.find('i').addClass('icon-white');

    this.setPath(anchor.attr('nw-path'));
  },

  // set path for file explorer
  setPath: function (path) {
    if (path.indexOf('~') == 0) {
      path = path.replace('~', process.env['HOME']);
    }
    this.folder.open(path);
    this.addressbar.set(path);
  }
};

$(document).ready(function() {
  initMenu();

  var results = new Results();
  results.open(process.cwd() + '/data', function() {
    console.log("Got " + results.resultData.length + " results");

    var resTable = $('#resultList');

    for(result in results.resultData) {
      var res = results.resultData[result];
      resTable.append($("<tr>")
        .append("<td>" + res.event + "</td>")
        .append("<td>" + res.round + "</td>")
        .append("<td>" + res.heat + "</td>")
        .append("<td>" + res.lap + "</td>")
        .append("<td>" + res.lane + "</td>")
        .append("<td>" + res.status + "</td>")
        .append("<td>" + res.rank + "</td>")
        .append("<td>" + res.time + "</td>")
        .append("<td>" + res.result + "</td>"));

    }
  });


});
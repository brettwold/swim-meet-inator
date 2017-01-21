'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

import ApiServer  from './server';

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 1536, height: 800});

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  var apiServer = new ApiServer();
  apiServer.startServer();

  mainWindow.loadURL('file://' + __dirname + '/ui/index.html#home');
  mainWindow.on('closed', function() {
    mainWindow = null;
    apiServer.close();
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

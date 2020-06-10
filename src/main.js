const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('src/index.html');

  mainWindow.once('ready-to-show', () => {
      autoUpdater.checkForUpdates();
  });

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', {version: app.getVersion()});
});


// update will be downloaded automatically once it is downloaded
// and user will be given a prompt to restart.
autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
    const dialogUpdate = {
        type: 'info',
        buttons: ['Restart'],
        title: 'Application Update',
        message: 'Tada has an update available. Please restart'
    }

    dialog.showMessageBox(dialogUpdate).then((returnValue) => {
        if (returnValue.response == 0) autoUpdater.quitAndInstall();
    });
});

autoUpdater.on('error', message => {
    console.error('There was a problem updating Tada');
    console.error(message);
});
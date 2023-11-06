import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow, checkGameLocation, installTranslation, 
  checkTranslation, checkTranslationUpToDate, uninstallTranslation, 
  getContributors, downloadUpdate, checkForUpdates, scanLocations } from './helpers';
import { ipcMain, dialog, shell } from 'electron';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    resizable: false,
    frame: false,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    console.log(port);
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    //mainWindow.webContents.openDevTools();
  }

  ipcMain.handle("open-gameLocation-dialog", async () => {
    const folder = await dialog.showOpenDialogSync(mainWindow, {
      properties: ['openDirectory']
    });
    return folder[0];
  });

  ipcMain.handle("download-translationFile", async (event, {link}: {link: string}) => {
      mainWindow.webContents.downloadURL(`${link}`);
  });
})();


ipcMain.handle("check-gameLocation", (event, {path}: {path: string}) => {
  return checkGameLocation(path);
});

ipcMain.handle("install-translation", (event, {path}: {path: string}) => {
  return installTranslation(path);
});

ipcMain.handle("check-translation", (event, {path}: {path: string}) => {
  return checkTranslation(path);
});

ipcMain.handle("check-translationUpToDate", (event, {path}: {path: string}) => {
  return checkTranslationUpToDate(path);
});

ipcMain.handle("uninstall-translation", (event, {path}: {path: string}) => {
  return uninstallTranslation(path);
});

ipcMain.handle("getContributors", () => {
  return getContributors();
});

ipcMain.on("contribute", () => {
  return shell.openExternal('https://tradsc.nightriderz.world');
});

ipcMain.handle('get-platform', () => {
  if (process.platform == 'win32') {
    return 'windows';
  } else{
    return 'linux';
  }
});

ipcMain.handle('get-version', () => {
  return app.getVersion();
});

ipcMain.handle('check-for-updates', async (event, {version}: {version: string}) => {
  const response = await checkForUpdates(version);
  console.log(response);
  return response;
});

ipcMain.handle('scan-locations', async (event, {executableName, version}: {executableName: string, version: string}) => {
  return scanLocations(executableName, version);
});

ipcMain.handle('close-app', () => {
  app.quit();
});

ipcMain.on('updateApplication', async (event, {url}: {url: string}) => {
  await downloadUpdate(url);
});

app.on('window-all-closed', () => {
  app.quit();
});

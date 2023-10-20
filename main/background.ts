import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow, checkGameLocation, installTranslation, checkTranslation, checkTranslationUpToDate, uninstallTranslation, getContributors } from './helpers';
import { ipcMain, dialog, shell } from 'electron';
import { autoUpdater } from 'electron-updater';

autoUpdater.setFeedURL('https://github.com/Skullyfox/SCFR/releases/latest/download');

autoUpdater.on('update-available', () => {
  const notification = new Notification('Mise à jour disponible', {
    body: 'Une nouvelle version de votre application est disponible. Voulez-vous la télécharger ?'
  });
  notification.onclick = () => {
    autoUpdater.downloadUpdate();
  };
});

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

ipcMain.handle('close-app', () => {
  app.quit();
});

app.on('window-all-closed', () => {
  app.quit();
});

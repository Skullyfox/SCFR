import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow, checkGameLocation, installTranslation, 
  checkTranslation, checkTranslationUpToDate, uninstallTranslation, 
  getContributors, downloadUpdate, checkForUpdates, scanOne, scanAll, scanDisks, createDB, updateUserPreferences, UserPreferences, getUserPreferences } from './helpers';
import { ipcMain, dialog, shell } from 'electron';

const isProd: boolean = process.env.NODE_ENV === 'production';
let db;

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();
  await createDB();
  
  const mainWindow = createWindow('main', {
    minWidth: 1152,
    minHeight: 648,
    resizable:true,
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

ipcMain.on('game-found', (event, {gamePath}: {gamePath: string}) => {
  event.reply('game-found-reply', {gamePath});
});

ipcMain.handle('scan-disks', async () => {
  return scanDisks();
});

ipcMain.handle('scan-one', async (event, {executableName, version, drive}: {executableName: string, version: string, drive: string}) => {
  return scanOne(executableName, version, drive);
});

ipcMain.handle('scan-all', async (event, {executableName, version, drive}: {executableName: string, version: string, drive: string}) => {
  return scanAll(executableName, version);
});

ipcMain.handle('close-app', () => {
  app.quit();
});

ipcMain.on('registerPath', async (event, {gamePath, version}: {gamePath: string, version: string}) => {
  getUserPreferences(async (err, row) => {
    if (!err && row){
      const data = new UserPreferences(
        1,
        version === 'LIVE' ? gamePath: row.GamePathLive,
        version === 'PTU' ? gamePath: row.GamePathPtu,
        version === 'EPTU' ? gamePath: row.GamePathEptu,
        version === 'TECH-PREVIEW' ? gamePath: row.GamePathTechPreview,
        new Date(),
        {},
      );
    
      await updateUserPreferences(data);
    }
  });
});

ipcMain.handle('get-user-preferences', async () => {
  return new Promise((resolve, reject) => {
    getUserPreferences((err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

ipcMain.on('updateApplication', async (event, {url}: {url: string}) => {
  await downloadUpdate(url);
});

app.on('window-all-closed', () => {
  app.quit();
});

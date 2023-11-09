import createWindow from './create-window';
import checkGameLocation from './translateFunctions/check-gameLocation';
import installTranslation from './translateFunctions/install-translation';
import checkTranslation from './translateFunctions/check-translation';
import checkTranslationUpToDate from './translateFunctions/check-translationUpToDate';
import uninstallTranslation from './translateFunctions/uninstall-translation';
import getContributors from './getContributors';
import { checkForUpdates, downloadUpdate} from './update-handler';
import {scanOne, scanAll} from './scanLocations';
import scanDisks from './scanDisks';
import { createDB, updateUserPreferences, getUserPreferences } from './database/functions';
import UserPreferences from './database/UserPreferences';

export {
  createWindow,
  checkGameLocation,
  installTranslation,
  checkTranslation,
  checkTranslationUpToDate,
  uninstallTranslation,
  getContributors,
  checkForUpdates,
  downloadUpdate,
  scanAll,
  scanOne,
  scanDisks,
  createDB,
  updateUserPreferences,
  getUserPreferences,
  UserPreferences
};

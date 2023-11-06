import createWindow from './create-window';
import checkGameLocation from './translateFunctions/check-gameLocation';
import installTranslation from './translateFunctions/install-translation';
import checkTranslation from './translateFunctions/check-translation';
import checkTranslationUpToDate from './translateFunctions/check-translationUpToDate';
import uninstallTranslation from './translateFunctions/uninstall-translation';
import getContributors from './getContributors';
import { checkForUpdates, downloadUpdate} from './update-handler';
import scanLocations from './scanLocations';

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
  scanLocations,
};

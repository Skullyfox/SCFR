import { app } from 'electron';
import path from 'path';
import sqlite3 from 'sqlite3';
import UserPreferences from './UserPreferences';

let db;

const createDB = async () => {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'database.db');

  db = new sqlite3.Database(dbPath, async (err) => {
    if (err) {
      console.error('Erreur lors de l\'ouverture de la base de données :', err.message);
    } else {
      db.run(`
        CREATE TABLE IF NOT EXISTS UserPreferences (
          id INTEGER PRIMARY KEY,
          GamePathLive TEXT DEFAULT NULL,
          GamePathPtu TEXT DEFAULT NULL,
          GamePathEptu TEXT DEFAULT NULL,
          GamePathTechPreview TEXT DEFAULT NULL,
          lastUpdate DATETIME DEFAULT NULL,
          UiPreferences TEXT DEFAULT NULL
        )
      `);

      const checkQuery = 'SELECT * FROM UserPreferences WHERE id = 1';
      db.get(checkQuery, async (err, row) => {
        if (err) {
          console.error('Erreur lors de la vérification de l\'entrée UserPreferences :', err.message);
        } else if (!row) {
          const insertQuery = `
            INSERT INTO UserPreferences (id, GamePathLive, GamePathPtu, GamePathEptu, GamePathTechPreview, lastUpdate, UiPreferences)
            VALUES (1, NULL, NULL, NULL, NULL, NULL, NULL)
          `;
          db.run(insertQuery, (err) => {
            if (err) {
              console.error('Erreur lors de l\'insertion des préférences par défaut :', err.message);
            } else {
              console.log('Entrée UserPreferences avec id = 1 créée avec des valeurs par défaut.');
            }
          });
        }
      });
    }
  });
  return;
};

const updateUserPreferences = (data: UserPreferences) => {

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO UserPreferences (id, GamePathLive, GamePathPtu, GamePathEptu, GamePathTechPreview, lastUpdate, UiPreferences)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(data.id, data.GamePathLive, data.GamePathPtu, data.GamePathEptu, data.GamePathTechPreview, data.lastUpdate, JSON.stringify(data.UiPreferences), (err) => {
    if (err) {
      console.error('Erreur lors de la mise à jour des préférences utilisateur :', err.message);
    } else {
      console.log('Préférences utilisateur mises à jour avec succès.');
    }
  });

  stmt.finalize();
}

const getUserPreferences = (callback) => {
  db.get(
    'SELECT * FROM UserPreferences WHERE id = 1',
    (err, row) => {
      if (err) {
        console.error('Erreur lors de la récupération des préférences utilisateur :', err.message);
        if (callback) callback(err, null);
      } else {
        if (row && row.UiPreferences) {
          try {
            row.UiPreferences = JSON.parse(row.UiPreferences);
          } catch (parseError) {
            console.error('Erreur lors de la désérialisation de UiPreferences :', parseError);
          }
        }
        if (callback) callback(null, row);
      }
    }
  );
}


export { createDB, updateUserPreferences, getUserPreferences };

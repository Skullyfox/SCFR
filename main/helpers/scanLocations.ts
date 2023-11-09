const { glob } = require('glob');
const { exec } = require('child_process');

const scanAll = async (executableName: string, version: string) => {
    try {
      const drives: Array<string>= await new Promise((resolve, reject) => {
        exec('wmic logicaldisk get caption', (error, stdout, stderr) => {
          if (error) {
            console.error(`Erreur lors de l'exécution de la commande : ${error.message}`);
            reject(error);
          }
          if (stderr) {
            console.error(`Erreur de la commande : ${stderr}`);
            reject(stderr);
          }

          const driveList = stdout
            .split('\n')
            .slice(1, -1)
            .map(drive => drive.trim())
            .filter(drive => drive !== '');

          resolve(driveList);
        });
      });

      const results = [];
      const searchPattern = `/**/${executableName}`;

      await Promise.all(drives.map(async (drive) => {
        const result = await glob(`${drive}\\${searchPattern}`, { nodir: true, root: `${drives}\\` });
        if (result.length > 0) {
          result.map(item => results.push(item));
        }
      }));
      
      const executablePath = results.find((path) => path.includes(version));

      if (executablePath === undefined) {
        return {
          gamePath: 'Not Found',
        };
      } else {
        const regex = /^(.*?\\StarCitizen).*/;
        const gamePath = executablePath.match(regex);

        return {
          gamePath: gamePath[1].replace("\\StarCitizen", ''),
        };
      }
    } catch (error) {
    }
  }

const scanOne = async (executableName: string, version: string, drive: string) => {
    const searchPattern = `/**/${executableName}`;

    const result = await glob(`${drive}\\${searchPattern}`, { nodir: true, root: `${drive}\\` });
      

      const executablePath = result.find((path) => path.includes(version));

      if (executablePath === undefined) {
        return {
          gamePath: 'Not Found',
        };
      } else {
        const regex = /^(.*?\\StarCitizen).*/;
        const gamePath = executablePath.match(regex);
        console.log(`Trouvé : ${gamePath[1].replace("\\StarCitizen", '')}`);
        return {
          gamePath: gamePath[1].replace("\\StarCitizen", ''),
        };
      }
  }

export { scanAll, scanOne };

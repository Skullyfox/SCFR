import React, {useState, useEffect} from 'react';
import Style from '../styles/scanLoading.module.css';
import { ipcRenderer } from 'electron';
import { AlertTriangle } from 'lucide-react';

function ScanLoading ({ version }) {
  const [scanStarted, setScanStarted] = useState(false);
  const [disksList, setDisksList] = useState<Array<{value: string, label: string}>>([]);
  const [diskSelected, setDiskSelected] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const scanOneDisk = () => {
    setScanStarted(true);
    ipcRenderer.invoke('scan-one', {executableName: "StarCitizen.exe", version: version, drive: diskSelected}).then(({gamePath}:{gamePath: string}) => {
      if (gamePath === 'Not Found') {
        setScanStarted(false);
        setAlertMessage(`Star Citizen ${version} n'as pas était trouvé sur le disque ${diskSelected}`);
        setDiskSelected('');
        return;
      } else {
        ipcRenderer.send('registerPath', {gamePath: gamePath, version: version});
        ipcRenderer.send('game-found', {gamePath: gamePath});
      }
    });
  };

  const scanAllDisks = () => {
    setScanStarted(true);
    ipcRenderer.invoke('scan-all', {executableName: "StarCitizen.exe", version: version}).then(({gamePath}:{gamePath: string}) => {
      if (gamePath === 'Not Found') {
        setScanStarted(false);
        setAlertMessage(`Star Citizen ${version} n'as pas était trouvé sur le disque ${diskSelected}`);
        setDiskSelected('');
        return;
      } else {
        ipcRenderer.send('registerPath', {gamePath: gamePath, version: version});
        ipcRenderer.send('game-found', {gamePath: gamePath});
      }
    });
  };

  useEffect(() => {
    ipcRenderer.invoke('scan-disks').then(({disks}:{disks: Array<string>}) => {
      disks.map((disk) => {
        setDisksList(disksList => [...disksList, {value: disk, label: disk}]);
      });
    });
  } ,[]);

    return scanStarted ? (
      <React.Fragment>
        <div className='flex flex-col min-h-screen w-full justify-center items-center py-20'>
          <div className='flex flex-col justify-center items-center'>
            <div className="flex my-10">
              <div className={`${Style.bubble} bg-blue-800`}></div>
              <div className={`${Style.bubble} bg-blue-800`}></div>
              <div className={`${Style.bubble} bg-blue-800`}></div>
            </div>
            <p className='text-xl'>Scan des fichiers du jeu</p>
            <p className='"text-gray-500 text-sm italic flex items-center gap-2 mt-2"'>~ 3 secondes</p>
          </div>
        </div>
      </React.Fragment>
    ) : (
      <React.Fragment>
      <div className='flex flex-col min-h-screen w-full justify-center items-center py-20'>
        <div className='flex flex-col justify-center items-center gap-3'>
          <h2 className='text-blue-600 text-base'>{version}</h2>
          <p className='text-xl'>Sélectionner un disque à Scanner :</p>
          {alertMessage ? (
            <span className="text-gray-500 text-sm italic flex items-center gap-2"> 
              <AlertTriangle size={13} strokeWidth={1} className="text-yellow-300" />
              {alertMessage}
            </span>
          ) : null}
          <select
            defaultValue=""
            onChange={(e) => {setDiskSelected(e.target.value);}}
            className='bg-gray-950 border border-gray-500 text-gray-50 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-800 block w-full p-2.5'>
            <option disabled value="">Choix du disque ...</option>
            {disksList.map((disk) => {
              return <option key={disk.value} value={disk.value}>{disk.label}</option>
            })}
          </select>
          {diskSelected !== '' ? (
            <div className="flex gap-2"> 
              <button onClick={() => scanOneDisk()} className="flex items-center gap-2 w-max text-base border-blue-400 border-2 rounded-md py-2 px-5 hover:border-blue-600 text-blue-400  hover:text-blue-600 transition-all duration-300">
                Scanner le disque {diskSelected}
              </button>
              <button onClick={() => scanAllDisks()} className="flex items-center gap-2 w-max text-base border-blue-400 border-2 rounded-md py-2 px-5 hover:border-blue-600 text-blue-400  hover:text-blue-600 transition-all duration-300">
                Scanner tout les disques (Plus long)
              </button>
            </div>
          ): (
            <div className="flex gap-2"> 
              <button disabled className="flex items-center gap-2 w-max text-base border-gray-600 border-2 rounded-md py-2 px-5 text-gray-600 transition-all duration-300">
                Scanner
              </button>
              <button onClick={() => scanAllDisks()} className="flex items-center gap-2 w-max text-base border-blue-400 border-2 rounded-md py-2 px-5 hover:border-blue-600 text-blue-400  hover:text-blue-600 transition-all duration-300">
                Scanner tout les disques (Plus long)
              </button>
            </div>
          )}
        </div>
      </div>
      </React.Fragment>
    )
}

export default ScanLoading;
import React, {useEffect, useState} from "react";
import Head from "next/head";
import { Trash2, Download } from 'lucide-react';

import { ipcRenderer } from 'electron';

export default function Ptu() {
  const [gameStatus, setGameStatus] = useState<boolean>(false);
  const [gameLocation, setGameLocation] = useState<string | null>(null);
  const [translationStatus, setTranslationStatus] = useState<boolean>(false);
  const [translationUpToDate, setTranslationUpToDate] = useState<boolean>(false);

  const livePathPrefix = 'StarCitizen/PTU';

  const handleOpenDialog = () => {
    ipcRenderer.invoke('open-gameLocation-dialog').then((res) => {
      localStorage.setItem('registeredGameLocation', `${res}/`);
      setGameLocation(`${res}/`);
      setGameStatus(true);
      ipcRenderer.invoke('check-translation', {path: `${res}/${livePathPrefix}`}).then((res) => {
        setTranslationStatus(res);
      });
    });
  };

  const handleInstallTranslation = () => {
    ipcRenderer.invoke('install-translation', {path: `${gameLocation}${livePathPrefix}`}).then((res) => {
      ipcRenderer.invoke('check-translation', {path: `${gameLocation}${livePathPrefix}`}).then((res) => {
        setTranslationStatus(res);
      });
      setTranslationUpToDate(true);
    });
  };

  const handleUninstallTranslation = () => {
    ipcRenderer.invoke('uninstall-translation', {path: `${gameLocation}${livePathPrefix}`}).then((res) => {
      ipcRenderer.invoke('check-translation', {path: `${gameLocation}${livePathPrefix}`}).then((res) => {
        setTranslationStatus(res);
      });
      setTranslationUpToDate(false);
    });
  };
  
  useEffect(() => {
    const registeredGameLocation = localStorage.getItem('registeredGameLocation');

    if (registeredGameLocation !== undefined) {
      ipcRenderer.invoke('check-gameLocation', {path: registeredGameLocation}).then(({path, status}) => {
        setGameLocation(path);
        setGameStatus(status);
        ipcRenderer.invoke('check-translation', {path: `${path}${livePathPrefix}`}).then((res) => {
          setTranslationStatus(res);
          if(res) {
            ipcRenderer.invoke('check-translationUpToDate', {path: `${path}${livePathPrefix}`}).then((res) => {
              setTranslationUpToDate(res);
            });
          }
        });
      });
    } else {
      ipcRenderer.invoke('check-gameLocation').then(({path, status}) => {
        setGameLocation(path);
        setGameStatus(status);
        ipcRenderer.invoke('check-translation', {path: `${path}${livePathPrefix}`}).then((res) => {
          setTranslationStatus(res);
          if(res) {
            ipcRenderer.invoke('check-translationUpToDate', {path: `${path}${livePathPrefix}`}).then((res) => {
              setTranslationUpToDate(res);
            });
          }
        });
      });
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>SCFR | Traduction PTU</title>
      </Head>
      <div className='container p-5 w-full pt-20 flex flex-col gap-5'>
        <h1 className="text-4xl">StarCitizen FR - Traduction PTU</h1>
        <hr className="border-blue-600"/>
        <h2 className="text-xl">
          Statut du jeu : { gameStatus ? 
          (<span className="text-blue-600 text-base"> Installé </span>) :
          (<span className="text-rose-400 text-base"> Non-installé / Introuvable </span>) } 
        </h2>
        <h2 className="text-xl">
          Emplacement du jeu : { gameLocation ? 
          (<span className="text-blue-600 text-base"> {gameLocation} </span>) :
          (<button onClick={handleOpenDialog}>Choisir un dossier</button>) } 
        </h2>
        {
          translationStatus ? (
            <h2 className="text-xl">
              Statut de la traduction : { translationUpToDate ? (
                <span className="text-blue-600 text-base"> À jour </span>
              ) : (
                <span className="text-rose-400 text-base"> Mise à jour disponnible </span>
              )}
            </h2>
          ) : (
            <h2 className="text-xl">Statut de la traduction : <span className="text-rose-400 text-base"> Traduction non-installée </span></h2>
          )
        }
        {
          gameStatus && gameLocation && translationStatus && !translationUpToDate ? (
            <button onClick={handleInstallTranslation} className="flex items-center gap-2 w-max border-blue-400 border-2 rounded-md py-2 px-5 hover:border-blue-600 text-blue-400  hover:text-blue-600 transition-all duration-300">
              <Download size={18} strokeWidth={1} />
              Mettre à jour la traduction
            </button>
          ) : null
        }
        { gameStatus && gameLocation && !translationStatus ? (
          <button onClick={handleInstallTranslation} className="flex items-center gap-2 w-max border-blue-400 border-2 rounded-md py-2 px-5 hover:border-blue-600 text-blue-400  hover:text-blue-600 transition-all duration-300">
            <Download size={18} strokeWidth={1} />
            Installer la traduction
          </button>
        ) : <button onClick={handleUninstallTranslation} className="flex items-center gap-2 w-max border-rose-400 border-2 rounded-md py-2 px-5 hover:border-rose-600 text-rose-400  hover:text-rose-600 transition-all duration-300">
              <Trash2 size={18} strokeWidth={1}/> 
              Désinstaller la traduction
            </button>}
      </div>
    </React.Fragment>
  )
}
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import { ipcRenderer } from 'electron';
import Link from 'next/link';

function Home() {
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    const storedPlatform = localStorage.getItem('platform');
    if (storedPlatform) {
      setPlatform(storedPlatform);
    } else {
      ipcRenderer.invoke('get-platform').then((plat: string) => {
        localStorage.setItem('platform', plat);
        setPlatform(plat);
      });
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>SCFR | Accueil</title>
      </Head>
      <div className='flex flex-col min-h-screen w-full justify-center items-center py-20'>
        <img className='w-1/5'
          src="/images/Logo.png" alt="Osint Companion Logo" />
        <h1 className='text-2xl text-blue-500'>StarCitizen FR</h1>
        <span className='text-sm text-blue-400'>Utilitaire d'installation pour la traduction française de StarCitizen</span>
      </div>
    </React.Fragment>
  );
}

export default Home;

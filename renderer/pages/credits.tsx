import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { ipcRenderer } from 'electron';

export default function Credits() {
  const [contributors, setContributors] = useState([]);

  const contributorsList = contributors.map((contributor) => {
      return (
        <li className="p-1 border ">
          <p className='text-md text-blue-400'>Nom : {contributor.name}</p>
          <p className='text-md text-blue-400'>Contributions : {contributor.total}</p>
        </li>
      )
  });

  const teamList = () => {
    const list = contributors.filter((contributor) => contributor.role === 'Admin');
    return list.map((contributor) => {
      return (
        <li>
          <p className='text-md text-blue-400'>{contributor.name}</p>
        </li>
      )
    });
  };

  useEffect(() => {
    ipcRenderer.invoke("getContributors").then((res) => {
      //console.log(res)
      setContributors(res);
    });
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>SCFR | Crédits</title>
      </Head>
      <div className='flex flex-col min-h-screen w-full pt-20 p-5'>
        <h1 className="text-4xl">Créateur du projet</h1>
        <hr className="border-blue-600 my-2"/>
        <span className='text-md text-blue-400 my-5'>Speedou</span>
        <h1 className="text-4xl">Équipe</h1>
        <hr className="border-blue-600 my-2"/>
        <ul className='grid grid-cols-4 gap-3 my-5'>
          {teamList()}
        </ul>
        <h1 className="text-4xl">Développeurs</h1>
        <hr className="border-blue-600 my-2"/>
        <ul className='grid grid-cols-4 gap-3 my-5'>
          <li className='text-md text-blue-400'>Onivoid</li>
          <li className='text-md text-blue-400'>Flisher Ofatale</li>
          <li className='text-md text-blue-400'>dalil01</li>
        </ul>
        <h1 className="text-4xl">Contributeurs</h1>
        <hr className="border-blue-600 my-2"/>
        <ul className='grid grid-cols-4 gap-3 my-5'>
          {contributorsList}
        </ul>
      </div>
    </React.Fragment>
  )
};

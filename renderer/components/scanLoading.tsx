import React from 'react';
import Style from '../styles/scanLoading.module.css';

function Content () {
    return (
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
    )
}

export default Content;
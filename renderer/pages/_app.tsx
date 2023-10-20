import React from 'react';
import type { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Sidebar from '../components/sidebar';
import Content from '../components/content';
config.autoAddCss = false

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <div className='overflow-x-hidden overflow-y-hidden'>
      <div className="flex min-h-screen">
        <Sidebar />
        <Content>
          <Component {...pageProps} />
        </Content>
      </div>
    </div>
  );

}

export default MyApp

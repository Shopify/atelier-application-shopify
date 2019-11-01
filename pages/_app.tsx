/* global API_KEY */
import React from 'react';
import Head from 'next/head';

function App({Component, pageProps}) {
  return (
    <>
      <Head>
        <title>Example d'application</title>
        <meta charSet="utf-8" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;

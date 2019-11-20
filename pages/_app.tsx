/* global API_KEY */
import React from 'react';
import Head from 'next/head';
import Cookies from 'js-cookie';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {AppProvider} from '@shopify/polaris';
import {Provider} from '@shopify/app-bridge-react';

import '@shopify/polaris/styles.css';
import translations from '@shopify/polaris/locales/fr.json';

const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include',
  },
});

function App({Component, pageProps}) {
  const config = {
    apiKey: API_KEY,
    forceRedirect: true,
    shopOrigin: Cookies.get('shopOrigin'),
  };
  return (
    <>
      <Head>
        <title>Example d'application</title>
        <meta charSet="utf-8" />
      </Head>
      <ApolloProvider client={client}>
        <Provider config={config}>
          <AppProvider i18n={translations}>
            <Component {...pageProps} />
          </AppProvider>
        </Provider>
      </ApolloProvider>
    </>
  );
}

export default App;

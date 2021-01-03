import '../styles/global.scss';
import '@shopify/polaris/dist/styles.css';

import {ApolloProvider} from '@apollo/client';
import {CssBaseline} from '@material-ui/core';
import {AppConfig} from '@shopify/app-bridge';
import {Provider} from '@shopify/app-bridge-react';
import {AppProvider} from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import Cookies from 'js-cookie';
import {AppProps} from 'next/dist/next-server/lib/router/router';
import Head from 'next/head';
import {RecoilRoot} from 'recoil';

import ClientRouter from '../components/ClientRouter';
import Layout from '../components/Layout';
import client from '../graphql/client';

const MyApp = ({Component, pageProps}: AppProps) => {
  // @ts-ignore
  const config: AppConfig = {apiKey: API_KEY, shopOrigin: Cookies.get('shopOrigin'), forceRedirect: true};

  return (
    <>
      <Head>
        <title>Sample App</title>
        <meta charSet="utf-8" />
      </Head>
      <Provider config={config}>
        <RecoilRoot>
          <ClientRouter />
          <AppProvider i18n={translations}>
            <ApolloProvider client={client}>
              <Layout>
                <CssBaseline />
                <Component {...pageProps} />
              </Layout>
            </ApolloProvider>
          </AppProvider>
        </RecoilRoot>
      </Provider>
    </>
  );
};

export default MyApp;

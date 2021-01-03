import {Page} from '@shopify/polaris';
import Axios from 'axios';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';

import useRedirect from '../hooks/useRedirect';
import LoadingPage from './LoadingPage';

interface ILayout {
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({children}) => {
  const [initLoading, setInitLoading] = useState(true);
  const [requestedBilling, setRequestedBilling] = useState(false);

  const {redirectToPage} = useRedirect();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location && !requestedBilling) {
      setRequestedBilling(true);

      Axios.post('/api/verifiybilling')
        .then((res) => {
          if (res.data === true) {
            setInitLoading(false);
          } else {
            redirectToPage(res.data, true);
          }
        })
        .catch((err) => console.log(err));
    }
  });

  if (initLoading) return <LoadingPage />;

  return <Page>{children}</Page>;
};

export default Layout;

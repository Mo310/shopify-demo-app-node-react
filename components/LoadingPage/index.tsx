import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

import styles from './LoadingPage.module.scss';

const LoadingPage = () => (
  <div className={styles.container}>
    <CircularProgress />
  </div>
);

export default LoadingPage;

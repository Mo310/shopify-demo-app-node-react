import {atom} from 'recoil';

export const appState = atom({
  key: 'appState',
  default: {
    currentPath: {
      path: '/',
      href: '/',
    },
    billing: 'init',
  },
});

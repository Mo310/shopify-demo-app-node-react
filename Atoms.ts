import Cookies from 'js-cookie';
import {atom} from 'recoil';

export const shopOriginState = atom<string>({
  key: 'shopOriginState',
  default: Cookies.get('shopOrigin'),
});

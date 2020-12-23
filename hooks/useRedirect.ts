import {useAppBridge} from '@shopify/app-bridge-react';
import {Redirect} from '@shopify/app-bridge/actions';

/**
 * @description
 * Funktion um die app innerhalb von shopify auf die angegebene seite zu bringen
 *
 * @example
 *
 * const {redirectToPage} = useRedirect();
 *
 * redirectToPage("/dashboard")
 */
const useRedirect = () => {
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  const redirectToPage = (url: string, remote: boolean = false) => {
    if (remote) {
      redirect.dispatch(Redirect.Action.REMOTE, {url: url});
    } else {
      redirect.dispatch(Redirect.Action.APP, url);
    }
  };

  return {redirectToPage};
};

export default useRedirect;

import {ClientRouter as AppBridgeClientRouter, History} from '@shopify/app-bridge-react';
import {withRouter} from 'next/router';

interface IClientRouter {
  router: History;
}

const ClientRouter = ({router}: IClientRouter) => <AppBridgeClientRouter history={router} />;

export default withRouter(ClientRouter);

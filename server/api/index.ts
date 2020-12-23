import Router from 'koa-router';

import {graphqlShopifyRequest} from '../buildShopRequestUrl';
import {dbQuery} from '../db/client';
import getSubscriptionUrl from '../getSubscriptionUrl';

const apiRouter = new Router({prefix: '/api'});

// const exampleData = {
//   'data': {
//     'currentAppInstallation': {
//       'activeSubscriptions': [
//         {
//           'name': 'Super Duper Plan',
//           'returnUrl': 'https://np-shopify.eu.ngrok.io/',
//           'id': 'gid://shopify/AppSubscription/20504051870',
//           'status': 'ACTIVE',
//           'createdAt': '2020-12-21T19:15:34Z',
//           'trialDays': 0,
//           'test': true,
//         },
//       ],
//     },
//   },
//   'extensions': {
//     'cost': {
//       'requestedQueryCost': 2,
//       'actualQueryCost': 2,
//       'throttleStatus': {'maximumAvailable': 1000, 'currentlyAvailable': 998, 'restoreRate': 50},
//     },
//   },
// };

apiRouter.post('/billing', async (ctx) => {
  return new Promise((resolve) => {
    const shop = ctx.cookies.get('shopOrigin') as string;

    dbQuery('SELECT subscription_status, access_token FROM shop WHERE shop_id = $1', [shop], async (result: any) => {
      const {subscription_status, access_token} = result.rows[0];

      if (subscription_status !== 'ACTIVE') {
        const url = await getSubscriptionUrl(ctx, access_token, shop, true);
        ctx.body = url;

        resolve(null);
      } else {
        ctx.body = true;
        resolve(null);
      }
    });
  });
});

export const getActiveSubscription = async (shop: string) => {
  return new Promise((resolve) => {
    const GET_ACTIVE_SUBSCRIPTION = JSON.stringify({
      query: `
      query getActiveSubscription {
        currentAppInstallation {
          activeSubscriptions {
            status
          }
        }
      }
    `,
    });

    dbQuery('SELECT access_token FROM shop WHERE shop_id = $1', [shop], async (result: any) => {
      const access_token = result.rows[0].access_token;

      const response = await graphqlShopifyRequest(shop, access_token, GET_ACTIVE_SUBSCRIPTION);

      const responseJson = await response.json();

      if (responseJson.data.currentAppInstallation.activeSubscriptions[0].status)
        resolve(responseJson.data.currentAppInstallation.activeSubscriptions[0].status);

      resolve(false);
    });
  });
};

apiRouter.post('/verifiybilling', async (ctx) => {
  const {shop} = ctx.query;

  const subscription = await getActiveSubscription(shop);

  dbQuery('UPDATE shop SET subscription_status = $1 WHERE shop_id = $2', [subscription, shop], (result) => {
    ctx.body = true;
  });
});

export default apiRouter;

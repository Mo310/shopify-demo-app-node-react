import Router from 'koa-router';

import {graphqlShopifyRequest} from '../buildShopRequestUrl';
import {dbQuery} from '../db/client';
import getSubscriptionUrl from '../getSubscriptionUrl';

const apiRouter = new Router({prefix: '/api'});

export const checkBilling = (ctx: any, accessToken?: string, shopUrl?: string): Promise<string | boolean> => {
  return new Promise((resolve) => {
    const shop = shopUrl || (ctx.cookies.get('shopOrigin') as string);

    const queryString = `SELECT subscription_status, access_token FROM shop WHERE shop_id = $1`;

    dbQuery(queryString, [shop], async (result: any) => {
      const {subscription_status, access_token} = result.rows[0];

      if (subscription_status !== 'ACTIVE') {
        const url = await getSubscriptionUrl(ctx, accessToken || access_token, shop, true);
        ctx.body = url;

        resolve(url);
      } else {
        ctx.body = true;
        resolve(true);
      }
    });
  });
};

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

      if (responseJson?.data?.currentAppInstallation?.activeSubscriptions[0]?.status)
        resolve(responseJson.data.currentAppInstallation.activeSubscriptions[0].status);

      resolve(false);
    });
  });
};

apiRouter.post('/verifiybilling', async (ctx) => {
  return new Promise(async (resolve) => {
    const shop = ctx.cookies.get('shopOrigin') as string;

    let subscription = await getActiveSubscription(shop);

    const queryString = 'UPDATE shop SET subscription_status = $1 WHERE shop_id = $2';

    dbQuery(queryString, [subscription === false ? 'CANCELLED' : subscription, shop], () => {
      if (subscription && subscription === 'ACTIVE') {
        console.log(subscription);
        ctx.body = true;
        resolve(true);
      } else {
        const url = checkBilling(ctx);
        resolve(url);
      }
    });
  });
});

export default apiRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveSubscription = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const koa_router_1 = __importDefault(require("koa-router"));
const buildShopRequestUrl_1 = require("../buildShopRequestUrl");
const client_1 = require("../db/client");
const getSubscriptionUrl_1 = __importDefault(require("../getSubscriptionUrl"));
const apiRouter = new koa_router_1.default({ prefix: '/api' });
bluebird_1.default.promisifyAll(apiRouter);
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
    return new bluebird_1.default((resolve) => {
        const shop = ctx.cookies.get('shopOrigin');
        client_1.dbQuery('SELECT subscription_status, access_token FROM shop WHERE shop_id = $1', [shop], async (result) => {
            const { subscription_status, access_token } = result.rows[0];
            if (subscription_status !== 'ACTIVE') {
                const url = await getSubscriptionUrl_1.default(ctx, access_token, shop, true);
                ctx.body = url;
                resolve(null);
            }
            else {
                ctx.body = true;
                resolve(null);
            }
        });
    });
});
const getActiveSubscription = async (shop) => {
    return new bluebird_1.default((resolve) => {
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
        client_1.dbQuery('SELECT access_token FROM shop WHERE shop_id = $1', [shop], async (result) => {
            const access_token = result.rows[0].access_token;
            const response = await buildShopRequestUrl_1.graphqlShopifyRequest(shop, access_token, GET_ACTIVE_SUBSCRIPTION);
            const responseJson = await response.json();
            if (responseJson.data.currentAppInstallation.activeSubscriptions[0].status)
                resolve(responseJson.data.currentAppInstallation.activeSubscriptions[0].status);
            resolve(false);
        });
    });
};
exports.getActiveSubscription = getActiveSubscription;
apiRouter.post('/verifiybilling', async (ctx) => {
    const { shop } = ctx.query;
    const subscription = await exports.getActiveSubscription(shop);
    client_1.dbQuery('UPDATE shop SET subscription_status = $1 WHERE shop_id = $2', [subscription, shop], (result) => {
        ctx.body = true;
    });
});
exports.default = apiRouter;

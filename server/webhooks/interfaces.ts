import {Context} from 'koa';

/**
 * @example
 * {
 *   "webhook": {
 *     "topic": "APP_SUBSCRIPTIONS_UPDATE",
 *     "domain": "toastshopping.myshopify.com",
 *     "payload": {
 *       "app_subscription": {
 *         "admin_graphql_api_id": "gid://shopify/AppSubscription/20497694878",
 *         "name": "Super Duper Plan",
 *         "status": "ACTIVE",
 *         "admin_graphql_api_shop_id": "gid://shopify/Shop/43857412254",
 *         "created_at": "2020-12-21T14:04:19+01:00",
 *         "updated_at": "2020-12-21T14:04:24+01:00"
 *       }
 *     }
 *   }
 * }
 *
 */
export interface SubWebhookContext extends Context {
  state: {
    webhook: {
      topic: 'APP_SUBSCRIPTIONS_UPDATE';
      domain: string;
      payload: {
        app_subscription: {
          admin_graphql_api_id: string;
          name: string;
          status: 'ACTIVE' | 'CANCELLED' | 'DECLINED' | 'PENDING';
          admin_graphql_api_shop_id: string;
          created_at: Date;
          updated_at: Date;
        };
      };
    };
  };
}

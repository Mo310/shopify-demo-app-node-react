import 'isomorphic-fetch';

import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import createShopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';
import graphQLProxy, {ApiVersion} from '@shopify/koa-shopify-graphql-proxy';
import {DeliveryMethod, registerWebhook, Topic} from '@shopify/koa-shopify-webhooks';
import Promise from 'bluebird';
import dotenv from 'dotenv';
import Koa from 'koa';
import Router from 'koa-router';
import session from 'koa-session';
import next from 'next';
import {postgraphile} from 'postgraphile';
import PrettyError from 'pretty-error';

import apiRouter from './server/api';
import {checkBilling} from './server/api';
import getShopData from './server/getShopData';
import webhookRouter from './server/webhooks';

PrettyError.start();

dotenv.config();
const port = parseInt(process.env.PORT as string, 10) || 3000;

const app = next({dev: process.env.NODE_ENV !== 'production'});

const handle = app.getRequestHandler();

const {SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, APP_URL} = process.env;

const shopifyApiVersipn = ApiVersion.October20;

const server = new Koa();

const router = new Router();

Promise.promisifyAll(router);

app.prepare().then(() => {
  server.use(session({sameSite: 'none', secure: true}, server));

  server.keys = [SHOPIFY_API_SECRET_KEY as string];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY as string,
      secret: SHOPIFY_API_SECRET_KEY as string,
      scopes: [
        'read_products',
        'write_products',
        'read_customers',
        'write_customers',
        'read_orders',
        'write_orders',
        'read_themes',
        'write_themes',
        'read_content',
        'write_content',
        'read_locations',
        'read_checkouts',
        'write_checkouts',
      ],
      async afterAuth(ctx) {
        const {shop, accessToken} = ctx.session as session.Session;

        ctx.cookies.set('shopOrigin', shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none',
        });

        const shopWebhook = async (topic: Topic, address: string) => {
          const registration = await registerWebhook({
            address: `${APP_URL}/webhooks/${address}`,
            topic: topic,
            accessToken,
            shop,
            // @ts-ignore
            apiVersion: shopifyApiVersipn,
            deliveryMethod: DeliveryMethod.Http,
          });

          if (registration.success) {
            console.log('Successfully registered webhook!');
          } else {
            console.log('Failed to register webhook', JSON.stringify(registration.result));
          }
        };

        shopWebhook('ORDERS_CREATE', 'orders/create');
        shopWebhook('ORDERS_UPDATED', 'orders/update');
        shopWebhook('ORDERS_DELETE', 'orders/delete');
        shopWebhook('ORDERS_PAID', 'orders/paid');
        shopWebhook('ORDERS_CANCELLED', 'orders/cancelled');
        shopWebhook('SHOP_UPDATE', 'shop/update');
        shopWebhook('APP_SUBSCRIPTIONS_UPDATE', 'app/subscriptions');
        shopWebhook('APP_UNINSTALLED', 'app/uninstalled');

        await getShopData(ctx, accessToken, shop);

        const billingActive = await checkBilling(ctx, accessToken, shop);

        if (billingActive === true) {
          ctx.redirect(`/?shop=${shop}`);
        } else {
          ctx.redirect(billingActive as string);
        }
      },
    })
  );

  server.use(
    postgraphile(process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/shopify', 'public', {
      graphqlRoute: '/app/graphql',
      graphiqlRoute: '/app/graphiql',
      appendPlugins: [PgSimplifyInflectorPlugin],
      watchPg: true,
      graphiql: true,
      dynamicJson: true,
      enhanceGraphiql: true,
      subscriptions: true,
      enableCors: true,
    })
  );

  server.use(graphQLProxy({version: shopifyApiVersipn}));

  router.get('(.*)', verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);

    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.use(webhookRouter.allowedMethods());
  server.use(webhookRouter.routes());

  server.use(apiRouter.allowedMethods());
  server.use(apiRouter.routes());

  server.listen(port, () => console.log(`> Ready on http://localhost:${port}`));
});

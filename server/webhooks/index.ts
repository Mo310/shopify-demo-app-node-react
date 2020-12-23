import {receiveWebhook} from '@shopify/koa-shopify-webhooks';
import Promise from 'bluebird';
import dotenv from 'dotenv';
import Router from 'koa-router';

import {checkIfExistsQuery, dbQuery} from '../db/client';
import exampleOrderWebhook from './exampleWebhookData.json';
import {SubWebhookContext} from './interfaces';

dotenv.config();

const webhookRouter = new Router({prefix: '/webhooks'});

Promise.promisifyAll(webhookRouter);

const {SHOPIFY_API_SECRET_KEY} = process.env;

const webhook = receiveWebhook({secret: SHOPIFY_API_SECRET_KEY as string});

const webhookLog = (topic: string) => console.log(`Recieved webhook: ${topic}`);

webhookRouter.post('/products/:topic', webhook, async (ctx) => {
  // const {topic, domain, payload} = ctx;

  // console.log(`Webhook topic: ${topic}`);

  // checkIfExistsQuery('SELECT exists(SELECT 1 from order where order_id=$1', payload.id, (orderExists) => {
  //   if (orderExists) {
  //     console.log(`Order with ${payload.id} already exists `);
  //   } else {
  //     insertQuery('INSERT INTO order(order_id, data, shop_id) VALUES ($1, $2 $3)', [payload.id, payload, domain], (res) => console.log(res));
  //   }
  // });

  ctx.res.statusCode = 200;
});

webhookRouter.post('/orders/:topic', webhook, async (ctx) => {
  const {topic, domain, payload} = exampleOrderWebhook.webhook;

  webhookLog(topic);

  checkIfExistsQuery('shoporder', 'shoporder_id', [payload.id], (orderExists) => {
    if (orderExists) {
      console.log(`Order with ${payload.id} already exists `);
    } else {
      dbQuery('INSERT INTO shoporder(order_id, data, shop_id) VALUES ($1, $2, $3)', [payload.id, payload, domain], (res) => console.log(res));
    }
  });

  ctx.res.statusCode = 200;
});

webhookRouter.post('/app/subscriptions', webhook, async (ctx: SubWebhookContext) => {
  const {topic, domain, payload} = ctx.state.webhook;

  webhookLog(topic);

  dbQuery('UPDATE shop SET subscription_status=$1 WHERE shop_id=$2', [payload.app_subscription.status, domain], (result) => console.log(result));

  ctx.res.statusCode = 200;
});

export default webhookRouter;

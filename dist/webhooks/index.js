"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_shopify_webhooks_1 = require("@shopify/koa-shopify-webhooks");
const bluebird_1 = __importDefault(require("bluebird"));
const dotenv_1 = __importDefault(require("dotenv"));
const koa_router_1 = __importDefault(require("koa-router"));
const client_1 = require("../db/client");
const exampleWebhookData_json_1 = __importDefault(require("./exampleWebhookData.json"));
dotenv_1.default.config();
const webhookRouter = new koa_router_1.default({ prefix: '/webhooks' });
bluebird_1.default.promisifyAll(webhookRouter);
const { SHOPIFY_API_SECRET_KEY } = process.env;
const webhook = koa_shopify_webhooks_1.receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });
const webhookLog = (topic) => console.log(`Recieved webhook: ${topic}`);
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
    const { topic, domain, payload } = exampleWebhookData_json_1.default.webhook;
    webhookLog(topic);
    client_1.checkIfExistsQuery('shoporder', 'shoporder_id', [payload.id], (orderExists) => {
        if (orderExists) {
            console.log(`Order with ${payload.id} already exists `);
        }
        else {
            client_1.dbQuery('INSERT INTO shoporder(order_id, data, shop_id) VALUES ($1, $2, $3)', [payload.id, payload, domain], (res) => console.log(res));
        }
    });
    ctx.res.statusCode = 200;
});
webhookRouter.post('/app/subscriptions', webhook, async (ctx) => {
    const { topic, domain, payload } = ctx.state.webhook;
    webhookLog(topic);
    client_1.dbQuery('UPDATE shop SET subscription_status=$1 WHERE shop_id=$2', [payload.app_subscription.status, domain], (result) => console.log(result));
    ctx.res.statusCode = 200;
});
exports.default = webhookRouter;

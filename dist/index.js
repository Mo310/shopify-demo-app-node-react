"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-fetch");
const koa_shopify_auth_1 = __importStar(require("@shopify/koa-shopify-auth"));
const koa_shopify_graphql_proxy_1 = __importStar(require("@shopify/koa-shopify-graphql-proxy"));
const koa_shopify_webhooks_1 = require("@shopify/koa-shopify-webhooks");
const bluebird_1 = __importDefault(require("bluebird"));
const dotenv_1 = __importDefault(require("dotenv"));
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_session_1 = __importDefault(require("koa-session"));
const next_1 = __importDefault(require("next"));
const pretty_error_1 = __importDefault(require("pretty-error"));
const url_1 = require("url");
const api_1 = __importDefault(require("./server/api"));
const getShopData_1 = __importDefault(require("./server/getShopData"));
const getSubscriptionUrl_1 = __importDefault(require("./server/getSubscriptionUrl"));
const webhooks_1 = __importDefault(require("./server/webhooks"));
pretty_error_1.default.start();
dotenv_1.default.config();
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next_1.default({
    dev: process.env.NODE_ENV !== 'production',
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, APP_URL } = process.env;
const shopifyApiVersipn = koa_shopify_graphql_proxy_1.ApiVersion.October20;
const server = new koa_1.default();
const router = new koa_router_1.default();
bluebird_1.default.promisifyAll(router);
app.prepare().then(() => {
    server.use(koa_session_1.default({ sameSite: 'none', secure: true }, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];
    server.use(koa_shopify_auth_1.default({
        apiKey: SHOPIFY_API_KEY,
        secret: SHOPIFY_API_SECRET_KEY,
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
            const { shop, accessToken } = ctx.session;
            ctx.cookies.set('shopOrigin', shop, {
                httpOnly: false,
                secure: true,
                sameSite: 'none',
            });
            const shopWebhook = async (topic, address) => {
                const registration = await koa_shopify_webhooks_1.registerWebhook({
                    address: `${APP_URL}/webhooks/${address}`,
                    topic: topic,
                    accessToken,
                    shop,
                    // @ts-ignore
                    apiVersion: shopifyApiVersipn,
                    deliveryMethod: koa_shopify_webhooks_1.DeliveryMethod.Http,
                });
                if (registration.success) {
                    console.log('Successfully registered webhook!');
                }
                else {
                    console.log('Failed to register webhook', JSON.stringify(registration.result));
                }
            };
            shopWebhook('ORDERS_CREATE', 'orders/create');
            shopWebhook('ORDERS_UPDATED', 'orders/update');
            shopWebhook('ORDERS_DELETE', 'orders/delete');
            shopWebhook('ORDERS_PAID', 'orders/paid');
            shopWebhook('ORDERS_CANCELLED', 'orders/cancelled');
            shopWebhook('APP_SUBSCRIPTIONS_UPDATE', 'app/subscriptions');
            await getShopData_1.default(ctx, accessToken, shop);
            await getSubscriptionUrl_1.default(ctx, accessToken, shop);
        },
    }));
    server.use(koa_shopify_graphql_proxy_1.default({ version: shopifyApiVersipn }));
    router.get('(.*)', koa_shopify_auth_1.verifyRequest(), async (ctx) => {
        const parsedUrl = url_1.parse(ctx.req.url, true);
        const { pathname } = parsedUrl;
        // if (pathname === '/api/verifiybilling') {
        //   const {shop} = ctx.query;
        //   const subsciption = await getActiveSubscription(shop);
        //   dbQuery('UPDATE shop SET subscription_status = $1 WHERE shop_id = $2', [subsciption, shop], (result) => {
        //     ctx.redirect('/');
        //   });
        // } else {
        await handle(ctx.req, ctx.res);
        // }
        ctx.res.statusCode = 200;
    });
    server.use(router.allowedMethods());
    server.use(router.routes());
    server.use(webhooks_1.default.allowedMethods());
    server.use(webhooks_1.default.routes());
    server.use(api_1.default.allowedMethods());
    server.use(api_1.default.routes());
    server.listen(port, () => console.log(`> Ready on http://localhost:${port}`));
});

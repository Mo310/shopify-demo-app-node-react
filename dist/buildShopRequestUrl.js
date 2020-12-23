"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlShopifyRequest = void 0;
const graphqlShopifyRequest = async (shop, accessToken, query) => await fetch(`https://${shop}/admin/api/2020-10/graphql.json`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
    },
    body: query,
});
exports.graphqlShopifyRequest = graphqlShopifyRequest;

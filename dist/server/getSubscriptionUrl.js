"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buildShopRequestUrl_1 = require("./buildShopRequestUrl");
const getSubscriptionUrl = async (ctx, accessToken, shop, returnUrl = false) => {
    const query = JSON.stringify({
        query: `mutation {
      appSubscriptionCreate(
          name: "Super Duper Plan"
          returnUrl: "${process.env.APP_URL}"
          test: true
          lineItems: [
          {
            plan: {
              appUsagePricingDetails: {
                  cappedAmount: { amount: 10, currencyCode: USD }
                  terms: "$1 for 1000 emails"
              }
            }
          }
          {
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: 10, currencyCode: USD }
              }
            }
          }
          ]
        ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
            }
        }
    }`,
    });
    const response = await buildShopRequestUrl_1.graphqlShopifyRequest(shop, accessToken, query);
    const responseJson = await response.json();
    console.log(responseJson);
    if (responseJson.error)
        return (ctx.response.status = 200);
    const confirmationUrl = responseJson.data.appSubscriptionCreate.confirmationUrl;
    if (returnUrl)
        return confirmationUrl;
    return ctx.redirect(confirmationUrl);
};
exports.default = getSubscriptionUrl;

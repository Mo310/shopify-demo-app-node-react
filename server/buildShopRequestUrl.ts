export const graphqlShopifyRequest = async (shop: string, accessToken: string, query: string) =>
  await fetch(`https://${shop}/admin/api/2020-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: query,
  });

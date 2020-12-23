import {Context} from 'koa';

import {graphqlShopifyRequest} from './buildShopRequestUrl';
import {checkIfExistsQuery} from './db/client';
import {insertFirstShopData, updateShopData} from './db/shopQuery';

// const exampleData = {
//   'accessToken': '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',
//   'shop': 'toastshopping.myshopify.com',
//   'responseJson': {
//     'data': {
//       'shop': {
//         'billingAddress': {
//           'address1': 'Eichenstieg 10',
//           'address2': '',
//           'city': 'Buchholz',
//           'country': 'Germany',
//           'countryCodeV2': 'DE',
//           'name': '',
//           'phone': '04181/283856',
//           'province': '',
//           'zip': '21244',
//         },
//         'id': 'gid://shopify/Shop/43857412254',
//         'name': 'toastshoppingg',
//         'email': 'moowee310@gmail.com',
//         'myshopifyDomain': 'toastshopping.myshopify.com',
//         'url': 'https://toastshopping.myshopify.com',
//       },
//     },
//     'extensions': {
//       'cost': {
//         'requestedQueryCost': 2,
//         'actualQueryCost': 2,
//         'throttleStatus': {'maximumAvailable': 1000, 'currentlyAvailable': 949, 'restoreRate': 50},
//       },
//     },
//   },
// };

const getShopData = async (ctx: Context, accessToken: string, shop: string) => {
  const query = JSON.stringify({
    query: `
      query getShopData {
        shop {
          billingAddress {
            address1
            address2
            city
            country
            countryCodeV2
            name
            phone
            province
            zip
          }
          id
          name
          email
          myshopifyDomain
          url
        }
      }
    `,
  });

  const response = await graphqlShopifyRequest(shop, accessToken, query);

  const responseJson = await response.json();

  console.log(JSON.stringify({accessToken, shop, responseJson}));

  checkIfExistsQuery('shop', 'shop_id', [shop], (exists) => {
    if (exists) {
      updateShopData(responseJson.data.shop, accessToken, shop);
      console.log(`shop mit id: ${shop} exestiert bereits`);
    } else {
      insertFirstShopData(responseJson.data.shop, accessToken, shop);
    }
  });

  return true;
};

export default getShopData;

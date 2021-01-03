import {checkIfExistsQuery, dbQuery} from './client';

export const shopDataArray = (data: any, accessToken: string, shop: string) => [
  data.billingAddress.address1,
  data.billingAddress.address1,
  data.billingAddress.city,
  data.billingAddress.country,
  data.billingAddress.countryCodeV2,
  data.email,
  data.name,
  data.billingAddress.phone,
  data.billingAddress.province,
  data.billingAddress.name,
  data.url,
  data.id,
  accessToken,
  data.billingAddress.zip,
  shop,
];

export const insertFirstShopData = (data: any, accessToken: string, shop: string) => {
  dbQuery(
    `INSERT INTO shop(
      address1, 
      address2, 
      city, 
      country, 
      country_code, 
      email, 
      name, 
      phone, 
      province, 
      shop_owner, 
      shop_url, 
      shopify_id, 
      access_token, 
      zip, 
      shop_id
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    shopDataArray(data, accessToken, shop),
    (res) => {
      console.log('insertFirstShopData: ', res);
    }
  );
};

export const updateShopData = (accessToken: string, shop: string) => {
  dbQuery(`UPDATE shop  SET access_token = $1 WHERE shop_id = $2`, [accessToken, shop], (res) => console.log('update shop data: ', res));
};

export const checkIfShopExists = async (id: string, callback: (result: boolean) => void) => {
  await checkIfExistsQuery('shop', 'shop_id', [id], callback);
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfShopExists = exports.updateShopData = exports.insertFirstShopData = exports.shopDataArray = void 0;
// import data from '../getShopDataResponse.json';
const client_1 = require("./client");
const shopDataArray = (data, accessToken, shop) => [
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
exports.shopDataArray = shopDataArray;
const insertFirstShopData = (data, accessToken, shop) => {
    client_1.dbQuery(`INSERT INTO shop(
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
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`, exports.shopDataArray(data, accessToken, shop), (res) => {
        console.log('insertFirstShopData: ', res);
    });
};
exports.insertFirstShopData = insertFirstShopData;
const updateShopData = (data, accessToken, shop) => {
    client_1.dbQuery(`UPDATE shop 
        SET address1 = $1, 
        address2 = $2, 
        city = $3, 
        country = $4,
        country_code = $5, 
        email = $6, 
        name = $7, 
        phone = $8, 
        province = $9, 
        shop_owner = $10,
        shop_url = $11, 
        shopify_id = $12, 
        access_token = $13, 
        zip = $14
        WHERE shop_id = $15`, exports.shopDataArray(data, accessToken, shop), (res) => console.log('update shop data: ', res));
};
exports.updateShopData = updateShopData;
const checkIfShopExists = async (id, callback) => {
    await client_1.checkIfExistsQuery('shop', 'shop_id', [id], callback);
};
exports.checkIfShopExists = checkIfShopExists;

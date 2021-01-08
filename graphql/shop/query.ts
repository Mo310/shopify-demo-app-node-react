import gql from 'graphql-tag';

export const GET_SHOP_DATA = gql`
  query shopData($shopId: String!) {
    shop(shopId: $shopId) {
      address1
      city
      countryCode
      email
      name
      phone
      province
      shopOwner
      zip
      shopLogo
    }
  }
`;

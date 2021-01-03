import {useQuery} from '@apollo/client';
import gql from 'graphql-tag';
import Cookies from 'js-cookie';
import React from 'react';

const SHOP_DATA_QUERY = gql`
  query MyQuery($shopId: String!) {
    shop(shopId: $shopId) {
      address1
      address2
      city
      country
      countryCode
      email
      name
      phone
      province
      shopOwner
      zip
    }
  }
`;

const Billing = () => {
  const shopOrigin = Cookies.get('shopOrigin');

  const {data} = useQuery(SHOP_DATA_QUERY, {variables: {shopId: shopOrigin}, context: {clientName: 'app'}});

  return <div>billing</div>;
};

export default Billing;

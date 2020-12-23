import {useQuery} from '@apollo/client';
import {Context, useAppBridge} from '@shopify/app-bridge-react';
import {Redirect} from '@shopify/app-bridge/actions';
import {Card, ResourceList, Stack, TextStyle, Thumbnail} from '@shopify/polaris';
import gql from 'graphql-tag';
import React from 'react';
import store from 'store-js';

import useRedirect from '../hooks/useRedirect';

const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

const ResourceListWithProducts = () => {
  const {redirectToPage} = useRedirect();

  const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();

  const {loading, data, error} = useQuery(GET_PRODUCTS_BY_ID, {variables: {ids: store.get('ids')}});

  if (loading) return <div>Loading…</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <Card>
      <ResourceList
        showHeader
        resourceName={{singular: 'Product', plural: 'Products'}}
        items={data.nodes}
        renderItem={(item: any) => {
          const media = (
            <Thumbnail
              source={item.images.edges[0] ? item.images.edges[0].node.originalSrc : ''}
              alt={item.images.edges[0] ? item.images.edges[0].node.altText : ''}
            />
          );
          const price = item.variants.edges[0].node.price;
          return (
            <ResourceList.Item
              id={item.id}
              media={media}
              accessibilityLabel={`View details for ${item.title}`}
              onClick={() => {
                store.set('item', item);
                redirectToPage('/edit-products');
              }}
            >
              <Stack>
                <Stack.Item fill>
                  <h3>
                    <TextStyle variation="strong">{item.title}</TextStyle>
                  </h3>
                </Stack.Item>
                <Stack.Item>
                  <p>${price}</p>
                </Stack.Item>
                <Stack.Item>
                  <p>Expires on {twoWeeksFromNow} </p>
                </Stack.Item>
              </Stack>
            </ResourceList.Item>
          );
        }}
      />
    </Card>
  );
};
export default ResourceListWithProducts;

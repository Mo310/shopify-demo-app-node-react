import gql from 'graphql-tag';

export const UPDATE_SHOP = gql`
  mutation updateShop($id: String!, $patch: ShopPatch!) {
    updateShop(input: {shopId: $id, patch: $patch}) {
      clientMutationId
    }
  }
`;

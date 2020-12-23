import {useMutation} from '@apollo/client';
import {Banner, Card, Form, FormLayout, Frame, Layout, Page, PageActions, TextField, Toast} from '@shopify/polaris';
import gql from 'graphql-tag';
import {useEffect, useState} from 'react';
import store from 'store-js';

const UPDATE_PRICE = gql`
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        title
      }
      productVariant {
        id
        price
      }
    }
  }
`;

const EditProduct = () => {
  const [handleSubmit, {error, data}] = useMutation(UPDATE_PRICE);

  const [discount, setDiscount] = useState('');

  const [price, setPrice] = useState('');

  const [variantId, setVariantId] = useState('');

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setDiscount(itemToBeConsumed());
  });

  const handleChange = (value) => setDiscount(value);

  const itemToBeConsumed = () => {
    const item = store.get('item');
    const price = item.variants.edges[0].node.price;
    const variantId = item.variants.edges[0].node.id;
    const discounter = price * 0.1;
    setPrice(price);
    setVariantId(variantId);
    return (price - discounter).toFixed(2);
  };

  return (
    <Frame>
      <Page>
        <Layout>
          {data && data.productVariantUpdate && <Toast content="Sucessfully updated" onDismiss={() => setShowToast(false)} />}
          <Layout.Section>{error && <Banner status="critical">{error.message}</Banner>}</Layout.Section>
          <Layout.Section>
            <Form>
              <Card sectioned>
                <FormLayout>
                  <FormLayout.Group>
                    <TextField prefix="$" value={price} disabled label="Original price" type="price" />
                    <TextField prefix="$" value={discount} onChange={handleChange} label="Discounted price" type="discount" />
                  </FormLayout.Group>
                  <p>This sale price will expire in two weeks</p>
                </FormLayout>
              </Card>
              <PageActions
                primaryAction={[
                  {
                    content: 'Save',
                    onAction: () => {
                      const productVariableInput = {
                        id: variantId,
                        price: discount,
                      };
                      handleSubmit({
                        variables: {input: productVariableInput},
                      });
                    },
                  },
                ]}
                secondaryActions={[
                  {
                    content: 'Remove discount',
                  },
                ]}
              />
            </Form>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
};

export default EditProduct;

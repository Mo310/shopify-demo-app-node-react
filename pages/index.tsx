import {useMutation, useQuery} from '@apollo/client';
import React from 'react';
import {useRecoilValue} from 'recoil';
import * as Yup from 'yup';

import {shopOriginState} from '../Atoms';
import Form from '../components/Form';
import FileUploadField from '../components/Form/FileUploadField';
import {getInitFormValues} from '../components/Form/functions';
import {countryList} from '../components/Form/lists';
import SelectField from '../components/Form/SelectField';
import TextField from '../components/Form/TextField';
import TemplateOne from '../components/TemplateOne';
import {ITemplateOne} from '../components/TemplatePreviews/templateOne';
import {UPDATE_SHOP} from '../graphql/shop/mutation';
import {GET_SHOP_DATA} from '../graphql/shop/query';

const validation = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const Home = () => {
  const shopOrigin = useRecoilValue(shopOriginState);

  const {loading, data, refetch} = useQuery(GET_SHOP_DATA, {variables: {shopId: shopOrigin}, context: {clientName: 'app'}});

  const [updateShop] = useMutation(UPDATE_SHOP);

  const initValues = getInitFormValues(
    {
      address1: '',
      city: '',
      countryCode: '',
      email: '',
      name: '',
      phone: '',
      province: '',
      shopOwner: '',
      zip: '',
      shopLogo: '',
    },
    data?.shop
  );

  const pdfData: ITemplateOne['data'] = {
    shopAddress: {
      name: data?.shop.name || '<shop name>',
      address1: data?.shop.address1 || '<shop address>',
      zipCity: `${data?.shop.zip || '<shop postal code>'} ${data?.shop.city || '<shop address city>'}`,
      countryCode: data?.shop.countryCode || '<shop country>',
    },
    shopLogo: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    invoiceNumber: '#1234',
    invoiceDate: new Date(),
    customerAddress: {
      name: 'Paul Krüger',
      address1: 'Eichenstieg 10',
      zipCity: '21244 Buchholz in der Nordheide',
      countryCode: 'DE',
    },
    items: [
      {
        title: 'BLue Silk Tuxedo',
        variant_title: 'small',
        quantity: 3,
        price: '60.00',
        total: '180.00',
      },
      {
        title: 'Chequered Red Shirt',
        variant_title: 'medium',
        quantity: 2,
        price: '49.00',
        total: '98.00',
      },
      {
        title: 'Classic Leather Jacket',
        variant_title: 'small',
        quantity: 4,
        price: '45.00',
        total: '180.00',
      },
    ],
    total: {
      subtotal: '397,83',
      tax: '63,17',
      total: '458',
    },
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="form">
          {!loading && (
            <Form
              initValues={initValues}
              validation={validation}
              submitFunction={(values) => updateShop({variables: {patch: values, id: shopOrigin}, context: {clientName: 'app'}})}
              refetch={refetch}
            >
              <TextField label="Straße & Nummer" name="address1" />
              <TextField label="Stadt" name="city" />
              <TextField label="E-Mail" name="email" />
              <TextField label="Postal Code" name="zip" />
              <SelectField label="Land" name="countryCode" list={countryList} />
              <TextField label="Shopname" name="name" />
              <TextField label="Phonenumber" name="phone" />
              <TextField label="Province" name="province" />
              <TextField label="Shop Onwer Name" name="shopOwner" />
              <FileUploadField label="Logo" name="shopLogo" />
            </Form>
          )}
        </div>
        {!loading && <TemplateOne data={pdfData} />}
      </div>
      <style jsx>{`
        .dashboard-container {
          display: flex;
          justify-content: space-evenly;
        }
        .form {
          max-width: 300px;
        }
      `}</style>
    </>
  );
};

export default Home;

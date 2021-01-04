import React from 'react';

import Header from './Header';
import InvoiceInfo from './InvoiceInfo';
import Table from './Table';

interface IInvoiceAddress {
  name?: string;
  address1?: string;
  zipCity?: string;
  countryCode?: string;
}

interface IItems {
  title: string;
  variant_title: string;
  quantity: number;
  price: string;
  total: string;
}

export interface ITemplateOne {
  data: {
    shopAddress?: IInvoiceAddress;
    shopLogo?: string;
    invoiceNumber?: string | number;
    invoiceDate?: Date;
    customerAddress?: IInvoiceAddress;
    items?: IItems[];
    total?: {
      subtotal: string;
      tax: string;
      total: string;
    };
  };
}

const TemplateOne: React.FC<ITemplateOne> = ({data}) => {
  return (
    <>
      <div className="main">
        <Header data={data} />
        <InvoiceInfo data={data} />
        <Table data={data} />
      </div>
      <style jsx>{`
        .main {
          width: 49.606em;
          min-height: 1px;
          font-size: 12px;
          font-family: 'Open Sans', sans-serif;
        }
      `}</style>
    </>
  );
};

export default TemplateOne;

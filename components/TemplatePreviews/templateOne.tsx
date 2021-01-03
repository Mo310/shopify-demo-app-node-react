import React from 'react';

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

interface IFromatedAddress {
  address: ITemplateOne['data']['customerAddress'] | ITemplateOne['data']['shopAddress'];
}

const FormateAddress: React.FC<IFromatedAddress> = ({address}) => (
  <>
    {Object.values(address).map((value) => (
      <span key={value}>{value}</span>
    ))}
  </>
);

export const formatDate = (date: Date) => new Date(date).toLocaleDateString(undefined, {day: 'numeric', month: 'long', year: 'numeric'});

const TemplateOne: React.FC<ITemplateOne> = ({data}) => {
  const {shopAddress, shopLogo, invoiceNumber, invoiceDate, customerAddress, items, total} = data;

  return (
    <>
      <div className="container">
        <div className="header">
          <div className="header-decoration"></div>
          <div className="header-empty"></div>
          <div className="header-logo">
            <img src={shopLogo} />
          </div>
          <div className="shop-address text-right">
            <FormateAddress address={shopAddress} />
          </div>
        </div>
        <div className="payment-container">
          <span className="invoice-number">Invoice {invoiceNumber}</span>
          <span className="invoice-date">{formatDate(invoiceDate)}</span>
          <FormateAddress address={customerAddress} />
        </div>
        <div className="table-container">
          <table className="table">
            <colgroup>
              <col className="col-1" />
            </colgroup>
            <thead>
              <tr className="text-left">
                <th className="th">Item</th>
                <th className="th">Description</th>
                <th className="th text-right">QTY</th>
                <th className="th text-right">Price</th>
                <th className="th text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                return (
                  <tr className="item-border" key={item.title}>
                    <td className="td">{item.title}</td>
                    <td className="td">{item.variant_title}</td>
                    <td className="td text-right">{item.quantity}</td>
                    <td className="td text-right">{item.price} €</td>
                    <td className="td text-right">{item.total} €</td>
                  </tr>
                );
              })}
              <tr className="total-row">
                <td colSpan={2}></td>
                <td className="td total-border" colSpan={2}>
                  Subtotal
                </td>
                <td className="td total-border text-right">{total.subtotal} €</td>
              </tr>
              <tr className="total-row">
                <td colSpan={2}></td>
                <td className="td total-border" colSpan={2}>
                  Tax
                </td>
                <td className="td total-border text-right">{total.tax} €</td>
              </tr>
              <tr className="total-row">
                <td colSpan={2}></td>
                <td className="td total-border" colSpan={2}>
                  Total
                </td>
                <td className="td total-border text-right">{total.total} €</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="footer">
          <div className="payment-info">
            <span className="payment-title">Payment Terms</span>
            {/* {{#each paymentInfo}} */}
            {/* <span className="payment-text">{{this}}</span> */}
            {/* {{/each}} */}
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          width: 49.606em;
          min-height: 70.63em;
          box-sizing: border-box;
          word-wrap: break-word;
          overflow-wrap: break-word;
          font-size: 9px;
          font-family: 'Open Sans', sans-serif;
          text-align: left;
        }

        span {
          display: block;
        }

        .text-right {
          text-align: right;
        }

        .header {
          height: 13em;
          display: flex;
          position: relative;
        }

        .header-decoration {
          height: 2em;
          background-color: #35424f;
          width: 100%;
          position: absolute;
        }

        .header-empty {
          width: 25%;
        }

        .header-logo {
          width: 50%;
        }

        .shop-address {
          font-size: 1em;
          width: 25%;
          margin-right: 2.8125em;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #787a7b;
        }

        .payment-container {
          margin: 2.8125em 4.375em;
          display: flex;
          flex-direction: column;
        }

        .invoice-number {
          font-size: 1.5em;
          letter-spacing: 0.0833333em;
          margin-bottom: 0.416667em;
        }

        .invoice-date {
          margin-bottom: 0.9375em;
        }

        .table-container {
          padding: 0em 4.375em;
          width: 100%;
          margin-bottom: 2.5em;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
        }

        .col-1 {
          width: 55%;
        }

        .th {
          background: #35424f;
          font-size: 1.25em;
          font-weight: normal;
          padding: 0.45em 0.75em;
          color: #ffffff;
        }

        .item-border {
          border-bottom: 0.2em dotted black;
        }

        .td {
          white-space: nowrap;
          padding: 0.875em 0.9375em;
        }

        .total-row {
          font-size: 1.25em;
        }

        .total-border {
          border-bottom: 0.05em solid black;
        }

        .footer {
          margin: 2.8125em 4.375em;
        }

        .payment-title {
          font-size: 1.125em;
          margin-bottom: 1em;
        }

        .payment-text {
          white-space: pre;
        }

        .payment-info {
          margin-bottom: 4.375em;
        }
      `}</style>
    </>
  );
};

export default TemplateOne;

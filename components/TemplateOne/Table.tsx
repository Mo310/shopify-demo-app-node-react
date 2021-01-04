import React from 'react';

import {ITemplateOne} from '.';

const Table: React.FC<ITemplateOne> = ({data}) => {
  return (
    <>
      <div className="container">
        <table className="table">
          <thead>
            <tr className="text-left">
              <th className="left">Item</th>
              <th className="left">Description</th>
              <th className="right">QTY</th>
              <th className="right">Price</th>
              <th className="right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.title} className="item-border">
                <td>{item.title}</td>
                <td>{item.variant_title}</td>
                <td className="right">{item.quantity}</td>
                <td className="right">{item.price} €</td>
                <td className="right">{item.total} €</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={2}></td>
              <td className="total-border" colSpan={2}>
                Subtotal
              </td>
              <td className="total-border right">{data.total.subtotal} €</td>
            </tr>
            <tr className="total-row">
              <td colSpan={2}></td>
              <td className="total-border" colSpan={2}>
                Tax
              </td>
              <td className="total-border right">{data.total.tax} €</td>
            </tr>
            <tr className="total-row">
              <td colSpan={2}></td>
              <td className="total-border" colSpan={2}>
                Total
              </td>
              <td className="total-border right">{data.total.total} €</td>
            </tr>
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .container {
          padding: 0em 4.375em;
          margin-bottom: 2.5em;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
        }

        th {
          background: #35424f;
          font-size: 1.25em;
          font-weight: normal;
          padding: 0.45em 0.75em;
          color: #ffffff;
        }

        .left {
          text-align: left;
        }

        .right {
          text-align: right;
        }

        .item-border {
          border-bottom: 0.1em solid black;
        }

        td {
          white-space: nowrap;
          padding: 0.875em 0.9375em;
        }

        .total-row {
          font-size: 1.1em;
        }

        .total-border {
          border-bottom: 0.05em solid black;
        }
      `}</style>
    </>
  );
};

export default Table;

import React from 'react';

import {ITemplateOne} from '../TemplatePreviews/templateOne';

const InvoiceInfo: React.FC<ITemplateOne> = ({data}) => {
  return (
    <>
      <div className="container">
        <span className="number">Invoice #1234</span>
        <span className="date">20. November 2020</span>
        {Object.values(data.customerAddress).map((value) => (
          <span key={value}>{value}</span>
        ))}
      </div>
      <style jsx>{`
        span {
          display: inline-block;
          width: 100%;
        }
        .container {
          margin: 2.8125em 4.375em;
        }
        .number {
          font-size: 1.5em;
          letter-spacing: 0.0833333em;
          margin-bottom: 0.416667em;
        }
        .date {
          margin-bottom: 0.9375em;
        }

        span {
          display: inline-block;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default InvoiceInfo;

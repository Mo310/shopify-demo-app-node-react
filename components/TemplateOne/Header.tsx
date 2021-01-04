import React from 'react';

import {ITemplateOne} from '.';

const Header: React.FC<ITemplateOne> = ({data}) => {
  return (
    <>
      <div className="decoration"></div>
      <header className="header">
        <div className="empty"></div>
        <div className="logo">
          <img src={data.shopLogo} className="shopImg" />
        </div>
        <div className="address">
          {Object.values(data.shopAddress).map((value) => (
            <span key={value}>{value}</span>
          ))}
        </div>
      </header>
      <style jsx>{`
        .empty,
        .logo {
          width: 33.33%;
          float: left;
          height: 100%;
        }

        .logo {
          position: relative;
        }

        .shopImg {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
        }

        .header {
          height: 13em;
          position: relative;
          display: 'block';
        }

        .decoration {
          height: 2em;
          background-color: #35424f;
          width: 100%;
        }

        .address {
          width: 33.33%;
          height: 13em;
          font-size: 0.9em;
          padding-right: 2.8125em;
          color: #787a7b;
          text-align: right;
          display: table-cell;
          vertical-align: middle;
          line-height: 1.9;
        }

        span {
          display: inline-block;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default Header;

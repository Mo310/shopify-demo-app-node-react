"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfExistsQuery = exports.dbQuery = exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'shopify',
    password: 'root',
    port: 5432,
});
//@ts-ignore
const dbQuery = async (text, params, callback, logResult) => {
    await exports.pool.connect().then((client) => client
        .query(text, params)
        .then((res) => {
        client.release();
        if (logResult)
            console.log('Query Successfull Response: ', res);
        callback(res);
    })
        .catch((err) => {
        client.release();
        console.error('Query Error: ', err.stack);
        callback(false);
    }));
};
exports.dbQuery = dbQuery;
const checkIfExistsQuery = async (table, idName, id, callback, logResult
//@ts-ignore
) => {
    exports.pool.connect().then((client) => {
        client
            .query(`SELECT exists(SELECT 1 from ${table} where ${idName}=$1)`, id)
            .then((res) => {
            client.release();
            if (logResult)
                console.log('checkIfExistsQuery Query Response: ', res);
            callback(res.rows[0].exists);
        })
            .catch((err) => {
            client.release();
            console.error('checkIfExistsQuery Query Error: ', err.stack);
            callback(false);
        });
    });
};
exports.checkIfExistsQuery = checkIfExistsQuery;

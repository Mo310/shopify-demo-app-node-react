import {Pool, QueryResult} from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'shopify',
  password: 'root',
  port: 5432,
});

//@ts-ignore
export const dbQuery = async (text: string, params: any, callback: (result: any) => void, logResult?: boolean): Promise<false | QueryResult<any>> => {
  await pool.connect().then((client) =>
    client
      .query(text, params)
      .then((res) => {
        client.release();
        if (logResult) console.log('Query Successfull Response: ', res);
        callback(res);
      })
      .catch((err) => {
        client.release();
        console.error('Query Error: ', err.stack);
        callback(false);
      })
  );
};

export const checkIfExistsQuery = async (
  table: string,
  idName: string,
  id: [any],
  callback: (result: boolean) => any,
  logResult?: boolean
  //@ts-ignore
): Promise<boolean> => {
  pool.connect().then((client) => {
    client
      .query(`SELECT exists(SELECT 1 from ${table} where ${idName}=$1)`, id)
      .then((res) => {
        client.release();
        if (logResult) console.log('checkIfExistsQuery Query Response: ', res);
        callback(res.rows[0].exists);
      })
      .catch((err) => {
        client.release();
        console.error('checkIfExistsQuery Query Error: ', err.stack);
        callback(false);
      });
  });
};

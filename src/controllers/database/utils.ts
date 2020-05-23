import { Pool, PoolClient, QueryResult } from "pg";
import { Table, TableRow } from "../../lib/v1";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();
  return client;
};

const getTableRowAsQueryString = (row: TableRow): string => {
  return [
    row.name,
    row.type,
    row.optional === true ? "" : "NOT NULL",
    row.primaryKey === true ? "PRIMARY KEY" : "",
    row.unique === true ? "UNIQUE" : "",
    row.references !== undefined && row.references.length > 0
      ? `REFERENCES ${row.references}`
      : "",
  ].join(" ");
};

export const createTable = (table: Table): Promise<QueryResult> => {
  return new Promise(async (resolve, reject) => {
    const client = await getClient();
    client.query(
      `CREATE TABLE ${table.name} (
        ${table.rows.map(getTableRowAsQueryString).join(",\n")}
      )`,
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};
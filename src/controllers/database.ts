import { Client, QueryResult, ClientBase } from "pg";
import { User } from "../lib/v1/discord";

export type Table = {
  name: string;
  rows: TableRow[];
};

export type TableRow = {
  name: string;
  type: string;
  optional?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
};

export type TableRowData = {
  name: string;
  value: string;
};

const getClient = async (): Promise<Client> => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();
  return client;
};

const getTableRowAsQueryString = (row: TableRow): string => {
  return [
    row.name,
    row.type,
    row.optional === true ? "" : "NOT NULL",
    row.primaryKey === true ? "PRIMARY KEY" : "",
    row.unique === true ? "UNIQUE" : "",
  ].join(" ");
};

const createTable = (table: Table): Promise<QueryResult> => {
  return new Promise(async (resolve, reject) => {
    const client = await getClient();
    client.query(
      `CREATE TABLE ${table.name} (
        ${table.rows.map(getTableRowAsQueryString).join(",\n")}
      )`,
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

const createUser = (user: User): Promise<QueryResult> => {
  return new Promise(async (resolve, reject) => {
    const client = await getClient();
    client.query(
      `INSERT INTO users(id, username, avatar, discriminator) VALUES($1, $2, $3, $4) RETURNING *`,
      [user.id, user.username, user.avatar, user.discriminator],
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const updateUser = (user: User): Promise<QueryResult> => {
  return new Promise(async (resolve, reject) => {
    const client = await getClient();
    client.query(
      `UPDATE users
      SET(id, username, avatar, discriminator)
      VALUES($1, $2, $3, $4)
      WHERE id = '${user.id}'`,
      [user.id, user.username, user.avatar, user.discriminator],
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const findAndUpdateOrCreateUser = (user: User): Promise<QueryResult> => {
  return new Promise(async (resolve, reject) => {
    const client = await getClient();
    client.query(
      `SELECT * FROM users WHERE id = '${user.id}'`,
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          resolve(createUser(user));
        } else {
          resolve(updateUser(user));
        }
      }
    );
  });
};

export const seed = async (): Promise<void> => {
  try {
    await createTable({
      name: "users",
      rows: [
        {
          name: "id",
          type: "VARCHAR (100)",
          primaryKey: true,
          unique: true,
          optional: false,
        },
        {
          name: "username",
          type: "VARCHAR (32)",
          optional: false,
        },
        {
          name: "avatar",
          type: "VARCHAR (255)",
        },
        {
          name: "discriminator",
          type: "VARCHAR (4)",
          optional: false,
        },
      ],
    });
  } catch (err) {
    switch (err.code) {
      // "relation already exists" error, ignore if caught
      case "42P07":
        break;
      default:
        throw err;
    }
  }
};

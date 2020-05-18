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
  references?: string;
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
    row.references !== undefined && row.references.length > 0
      ? `REFERENCES ${row.references}`
      : "",
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
      WHERE id = $1`,
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
  const createTableAndThrowUnknownErr = async (table: Table) => {
    try {
      await createTable(table);
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
  await createTableAndThrowUnknownErr({
    name: "users",
    rows: [
      {
        name: "id",
        type: "VARCHAR (100)",
        primaryKey: true,
        unique: true,
      },
      {
        name: "username",
        type: "VARCHAR (32)",
      },
      {
        name: "avatar",
        type: "VARCHAR (255)",
      },
      {
        name: "discriminator",
        type: "VARCHAR (4)",
      },
    ],
  });
  await createTableAndThrowUnknownErr({
    name: "groups",
    rows: [
      {
        name: "id",
        type: "SERIAL",
        primaryKey: true,
        unique: true,
      },
      {
        name: "name",
        type: "VARCHAR (100)",
      },
    ],
  });
  await createTableAndThrowUnknownErr({
    name: "roles",
    rows: [
      {
        name: "id",
        type: "SERIAL",
        primaryKey: true,
        unique: true
      },
      {
        name: "name",
        type: "VARCHAR (100)"
      }
    ]
  });
  await createTableAndThrowUnknownErr({
    name: "members",
    rows: [
      {
        name: "id",
        type: "SERIAL",
        primaryKey: true,
        unique: true,
      },
      {
        name: "user_id",
        type: "VARCHAR (100)",
        references: "users(id)"
      },
      {
        name: "group_id",
        type: "INTEGER",
        references: "groups(id)"
      },
      {
        name: "role_id",
        type: "INTEGER",
        references: "roles(id)"
      },
      {
        name: "currency",
        type: "MONEY"
      }
    ]
  });
};

import fs from "fs";
import path from "path";
import { Table } from "../../lib/v1";
import { getClient, createTable } from "./utils";
import { QueryResult } from "pg";

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

const createSessionsTableAndThrowUnknownErr = async () => {
  const sessionsTableSQLPath = path.resolve(
    "./node_modules/connect-pg-simple/table.sql"
  );
  const sessionsTableSQL = fs.readFileSync(sessionsTableSQLPath, {
    encoding: "utf8",
  });
  try {
    const client = await getClient();
    await new Promise((resolve, reject) => {
      client.query(sessionsTableSQL, (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
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

export default async (): Promise<void> => {
  await createSessionsTableAndThrowUnknownErr();
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
        unique: true,
      },
      {
        name: "name",
        type: "VARCHAR (100)",
      },
    ],
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
        references: "users(id)",
      },
      {
        name: "group_id",
        type: "INTEGER",
        references: "groups(id)",
      },
      {
        name: "role_id",
        type: "INTEGER",
        references: "roles(id)",
      },
      {
        name: "currency",
        type: "INTEGER",
      },
    ],
  });
  await createTableAndThrowUnknownErr({
    name: "bets",
    rows: [
      {
        name: "id",
        type: "SERIAL",
        primaryKey: true,
        unique: true,
      },
      {
        name: "creator_id",
        type: "VARCHAR (100)",
        references: "users(id)",
      },
      {
        name: "winner_id",
        type: "VARCHAR (100)",
        references: "users(id)",
        optional: true,
      },
      {
        name: "group_id",
        type: "INTEGER",
        references: "groups(id)",
      },
      {
        name: "name",
        type: "VARCHAR (100)",
      },
      {
        name: "description",
        type: "TEXT",
        optional: true,
      },
      {
        name: "proof",
        type: "TEXT",
        optional: true,
      },
    ],
  });
  await createTableAndThrowUnknownErr({
    name: "wagers",
    rows: [
      {
        name: "id",
        type: "SERIAL",
        primaryKey: true,
        unique: true,
      },
      {
        name: "bet_id",
        type: "INTEGER",
        references: "bets(id)",
      },
      {
        name: "user_id",
        type: "VARCHAR (100)",
        references: "users(id)",
      },
      {
        name: "amount",
        type: "INTEGER",
      },
      {
        name: "time_placed",
        type: "timestamp",
      },
    ],
  });
};

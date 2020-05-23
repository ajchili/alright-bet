import { Table } from "../../lib/v1";
import { createTable } from "./utils";

export default async (): Promise<void> => {
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
        type: "MONEY",
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
        type: "MONEY",
      },
      {
        name: "time_placed",
        type: "INTEGER",
      },
    ],
  });
};

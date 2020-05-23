import { Table } from "../../lib/v1";
import * as Bets from "./bets";
import * as Groups from "./groups";
import * as Members from "./members";
import * as Roles from "./roles";
import * as Users from "./users";
import { createTable } from "./utils";

export const bets = {
  ...Bets
};

export const groups = {
  ...Groups,
};

export const members = {
  ...Members,
};

export const users = {
  ...Users,
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
  await Roles.seed();
};

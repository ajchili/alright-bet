import { QueryResult } from "pg";
import { constants, Role } from "../../lib/v1";
import { getClient } from "./utils";

const create = async (name: string): Promise<QueryResult> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "INSERT INTO roles(name) VALUES($1) RETURNING *",
      [name],
      (err: Error, result: QueryResult) => {
        client.release();
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const get = async (id: number): Promise<Role> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT * FROM roles WHERE id = $1",
      [id],
      (err: Error, result: QueryResult) => {
        client.release();
        if (err) {
          reject(err);
        } else {
          const roles = result.rows[0] as Role;
          resolve(roles);
        }
      }
    );
  });
};

export const getId = async (name: string): Promise<number> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT * FROM roles where name = $1",
      [name],
      (err: Error, result: QueryResult) => {
        client.release();
        if (err) {
          reject(err);
        } else {
          const role = result.rows[0] as Role;
          resolve(role.id);
        }
      }
    );
  });
};

export const getAll = async (): Promise<Role[]> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query("SELECT * FROM roles", (err: Error, result: QueryResult) => {
      client.release();
      if (err) {
        reject(err);
      } else {
        const roles = result.rows as Role[];
        resolve(roles);
      }
    });
  });
};

export const seed = async () => {
  const existingRoles = await getAll();
  const neededRoles = constants.ROLE_NAMES.filter((roleName) => {
    return !existingRoles.find((role) => role.name.toUpperCase() === roleName);
  });
  await Promise.all(neededRoles.map(create));
};

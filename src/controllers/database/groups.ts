import { QueryResult } from "pg";
import { constants, Group, User } from "../../lib/v1";
import { create as createMember } from "./members";
import { getId as getRoleId } from "./roles";
import { getClient } from "./utils";

export const create = (user: User, name: string): Promise<Group> => {
  return new Promise(async (resolve, reject) => {
    const client = await getClient();
    client.query(
      "INSERT INTO groups(name) VALUES($1) RETURNING *",
      [name],
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          const group = result.rows[0] as Group;
          getRoleId(constants.ROLE_NAMES[0])
            .then((roleId) => {
              return createMember(user, group.id, roleId);
            })
            .then(() => resolve(group))
            .catch(reject);
        }
      }
    );
  });
};

export const find = (id: number): Promise<Group> => {
  return new Promise(async (resolve, reject) => {
    const client = await getClient();
    client.query(
      "SELECT * FROM groups WHERE id = $1",
      [id],
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          const group = result.rows[0] as Group;
          resolve(group);
        }
      }
    );
  });
};

export const getForUser = (user: User): Promise<Group[]> => {
  return new Promise(async (resolve, reject) => {
    const client = await getClient();
    client.query(
      "SELECT groups.id, groups.name FROM groups LEFT JOIN members ON groups.id = members.group_id WHERE members.user_id = $1",
      [user.id],
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          const groups = result.rows as Group[];
          resolve(groups);
        }
      }
    );
  });
};

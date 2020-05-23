import { QueryResult } from "pg";
import { constants, Group, User } from "../../lib/v1";
import { create as createMember } from "./members";
import { getId as getRoleId } from "./roles";
import { getClient } from "./utils";

export const create = (user: User, name: string): Promise<Group> => {
  return new Promise(async (resolve, reject) => {
    const client = await getClient();
    client.query(
      `INSERT INTO groups(name) VALUES($1) RETURNING *`,
      [name],
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          const group = result.rows[0] as Group;
          getRoleId(constants.ROLE_NAMES[0])
            .then(roleId => {
              return createMember(user, group.id, roleId);
            })
            .then(() => resolve(group))
            .catch(reject);
        }
      }
    );
  });
};

import { QueryResult } from "pg";
import { constants, Group, Member, User } from "../../lib/v1";
import { create as createMember } from "./members";
import { getId as getRoleId } from "./roles";
import { getClient } from "./utils";

export const create = async (user: User, name: string): Promise<Group> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "INSERT INTO groups(name) VALUES($1) RETURNING *",
      [name],
      (err: Error, result: QueryResult) => {
        client.release(true);
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

export const destroy = async (id: number): Promise<QueryResult> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "DELETE FROM groups WHERE id = $1",
      [id],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const find = async (id: number): Promise<Group> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT * FROM groups WHERE id = $1",
      [id],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          if (result.rowCount === 0) {
            reject(new Error("Group does not exist!"));
          } else {
            const group = result.rows[0] as Group;
            resolve(group);
          }
        }
      }
    );
  });
};

export const join = async (user: User, id: number): Promise<Member> => {
  const group = await find(id);
  const memberRoleId = await getRoleId(constants.ROLE_NAMES[1]);
  return createMember(user, group.id, memberRoleId);
};

export const getOwner = async (id: number): Promise<User> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT users.id, users.username, users.discriminator, users.avatar FROM users JOIN members ON users.id = members.user_id JOIN roles ON members.role_id = roles.id WHERE members.group_id = $1 AND roles.name = $2",
      [id, constants.ROLE_NAMES[0]],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          const user = result.rows[0] as User;
          resolve(user);
        }
      }
    );
  });
};

export const getForUser = async (user: User): Promise<Group[]> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT groups.id, groups.name FROM groups LEFT JOIN members ON groups.id = members.group_id WHERE members.user_id = $1",
      [user.id],
      (err: Error, result: QueryResult) => {
        client.release(true);
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

import { QueryResult } from "pg";
import { constants, Group, GroupMember, Member, User } from "../../lib/v1";
import { getClient } from "./utils";

export const create = async (
  user: User,
  groupId: number,
  roleId: number
): Promise<Member> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "INSERT INTO members(user_id, group_id, role_id, currency) VALUES($1, $2, $3, $4) RETURNING *",
      [user.id, groupId, roleId, constants.DEFAULT_CURRENCY_AMOUNT],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          const member = result.rows[0] as Member;
          resolve(member);
        }
      }
    );
  });
};

export const find = async (user: User, group: Group): Promise<Member> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT * FROM members WHERE user_id = $1 AND group_id = $2",
      [user.id, group.id],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          reject("Member does not exist!");
        } else {
          const member = result.rows[0] as Member;
          resolve(member);
        }
      }
    );
  });
};

export const propagateGroupDestroy = async (
  groupID: number
): Promise<QueryResult> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "DELETE FROM members WHERE group_id = $1",
      [groupID],
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

export const getForGroup = async (id: number): Promise<GroupMember[]> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT members.id, members.user_id, members.role_id, members.currency, users.username, users.discriminator, users.avatar FROM members LEFT JOIN users ON members.user_id = users.id WHERE members.group_id = $1",
      [id],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          const users = result.rows as GroupMember[];
          resolve(users);
        }
      }
    );
  });
};

export const leaveGroup = async (
  user: User,
  group: Group
): Promise<QueryResult> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "DELETE FROM members WHERE user_id = $1 AND group_id = $2",
      [user.id, group.id],
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

export const isUserInGroup = async (
  user: User,
  groupId: number
): Promise<boolean> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT * FROM members WHERE user_id = $1 AND group_id = $2",
      [user.id, groupId],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          resolve(result.rowCount === 1);
        }
      }
    );
  });
};

export const stimulateEconomyForGroup = async (group: Group): Promise<void> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "UPDATE members SET currency = currency + $2 WHERE group_id = $1",
      [group.id, constants.STIMULUS_CURRENCY_AMOUNT],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

export const update = async (member: Member): Promise<Member> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "UPDATE members SET id = $1, user_id = $2, group_id = $3, role_id = $4, currency = $5 WHERE id = $1 RETURNING *",
      [
        member.id,
        member.user_id,
        member.group_id,
        member.role_id,
        member.currency,
      ],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          reject(new Error("Member does not exist!"));
        } else {
          resolve(result.rows[0] as Member);
        }
      }
    );
  });
};

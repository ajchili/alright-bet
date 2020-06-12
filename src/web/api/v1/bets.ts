import { ActiveBet, Bet } from "../../../lib/v1";

export const create = (
  groupId: number | string,
  name: string,
  description: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch("/api/v1/bets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId,
        name,
        description,
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          reject(response.body);
        }
        response
          .json()
          .then((json) => {
            const { redirect = "/" } = json;
            resolve(redirect);
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

export const complete = (
  id: number | string,
  body: FormData
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/bets/${id}/complete`, {
      method: "POST",
      body,
    })
      .then((response) => {
        if (response.status !== 200) {
          reject(response.body);
        }
        resolve();
      })
      .catch(reject);
  });
};

export const get = (id: number | string): Promise<Bet> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/bets/${id}`)
      .then((response) => {
        if (response.status !== 200) {
          reject(response.body);
        }
        resolve(response.json() as Promise<Bet>);
      })
      .catch(reject);
  });
};

export const getActiveForGroup = (
  groupId: number | string
): Promise<ActiveBet[]> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/groups/${groupId}/bets?active=true`)
      .then((response) => {
        if (response.status !== 200) {
          reject(response);
        }
        resolve(response.json());
      })
      .catch(reject);
  });
};

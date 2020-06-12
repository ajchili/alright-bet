import { DetailedWager } from "../../../lib/v1";

export const create = (
  betId: number | string,
  amount: number
): Promise<void> => {
  if (amount < 1) {
    throw new Error("Unable to create wager, amount must be greater than 0!");
  }
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/bets/${betId}/wagers/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
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

export const getForBet = (betId: number | string): Promise<DetailedWager[]> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/bets/${betId}/wagers`)
      .then((response) => {
        if (response.status !== 200) {
          reject(response.body);
        }
        resolve(response.json());
      })
      .catch(reject);
  });
};

export const remove = (betId: number | string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/bets/${betId}/wagers`, {
      method: "DELETE",
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

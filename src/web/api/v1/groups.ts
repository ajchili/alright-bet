import { User } from "../../../lib/v1";

export const create = () => {};

export const getOwner = (id: number | string): Promise<User> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/groups/${id}/owner`)
      .then(response => {
        if (response.status !== 200) {
          reject(response.body);
        }
        resolve(response.json());
      })
      .catch(reject);
  });
};

export const remove = (id: number | string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/groups/${id}`, {
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

export const stimulateEconomy = (id: number | string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/groups/${id}/stimulateEconomy`, {
      method: "POST",
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

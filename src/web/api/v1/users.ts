import { DetailedUser } from "../../../lib/v1";

export const get = (id: string): Promise<DetailedUser> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/users/${id}`)
      .then((response) => {
        if (response.status !== 200) {
          reject(response.body);
        }
        resolve(response.json());
      })
      .catch(reject);
  });
};

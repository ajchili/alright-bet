import * as Bets from "./bets";
import * as Groups from "./groups";
import * as Members from "./members";
import * as Roles from "./roles";
import * as Users from "./users";
import * as Utils from "./utils";
import * as Wagers from "./wagers";
import seedDatabase from "./seed";

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

export const wagers = {
  ...Wagers
};

export const getPool = Utils.getPool;

export const seed = async (): Promise<void> => {
  await seedDatabase();
  await Roles.seed();
};

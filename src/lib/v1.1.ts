import * as v1 from "./v1";

export interface DetailedWager extends v1.DetailedWager {
  details: string;
}

export interface Wager extends v1.Wager {
  details: string;
}

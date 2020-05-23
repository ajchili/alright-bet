export const constants = {
  DEFAULT_CURRENCY_AMOUNT: 10,
  ROLE_NAMES: ["OWNER", "MEMBER"],
};

export interface ActiveBet {
  id: number;
  name: string;
  description: string;
  creator: User;
  betters: User[];
  wagers: number;
}

export interface Bet {
  id: number;
  creator_id: string;
  winner_id?: string;
  group_id: number;
  name: string;
  description?: string;
  proof?: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
}

export interface DetailedWager {
  id: number;
  user_id: string;
  amount: number;
  time_placed: Date;
  username: string;
  discriminator: string;
  avatar?: string;
  amended?: boolean;
}

export interface Group {
  id: number;
  name: string;
}

export interface GroupMember {
  id: number;
  user_id: string;
  role_id: number;
  currency: string;
  username: string;
  discriminator: string;
  avatar?: string;
}

export interface Member {
  id: number;
  user_id: string;
  group_id: number;
  role_id: number;
  currency: number;
}

export interface Role {
  id: number;
  name: string;
}

export interface Table {
  name: string;
  rows: TableRow[];
}

export interface TableRow {
  name: string;
  type: string;
  optional?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  references?: string;
}

export interface TableRowData {
  name: string;
  value: string;
}

export interface Wager {
  id: number;
  bet_id: number;
  user_id: string;
  amount: number;
  time_placed: Date;
}

export interface User extends DiscordUser {}

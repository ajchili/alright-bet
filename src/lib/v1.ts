export const constants = {
  DEFAULT_CURRENCY_AMOUNT: 10,
  COLORS: [
    "#db2828", // RED
    "#fbbd08", // YELLOW
    "#21ba45", // GREEN
    "#2185d0", // BLUE
    "#a333c8", // PURPLE
    "#f2711c", // ORANGE
    "#b5cc18", // OLIVE
    "#00b5ad", // TEAL
    "#6435c9", // VIOLET
    "#a5673f", // BROWN
    "#e03997", // PINK
  ],
  ROLE_NAMES: ["OWNER", "MEMBER"],
  STIMULUS_CURRENCY_AMOUNT: 10,
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

export interface DetailedUser extends User {
  memberships: Member[];
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

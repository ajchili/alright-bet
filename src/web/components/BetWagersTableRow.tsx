import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import { DetailedWager } from "../../lib/v1";
import UserPill from "./UserPill";

interface Props {
  wager: DetailedWager;
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { wager } = this.props;
    const validWager = wager.amount > 0 && !wager.amended;
    const user = {
      id: wager.user_id,
      username: wager.username,
      discriminator: wager.discriminator,
      avatar: wager.avatar
    };

    return (
      <Table.Row
        positive={validWager}
        negative={!validWager}
      >
        <Table.Cell><UserPill size="regular" user={user} /></Table.Cell>
        <Table.Cell>{wager.amount || "Removed Wager"}</Table.Cell>
        <Table.Cell>{wager.time_placed}</Table.Cell>
      </Table.Row>
    );
  }
}
import React, { Component } from "react";
import { Header, Image, Table } from "semantic-ui-react";
import { DetailedWager } from "../lib/v1";

interface Props {
  wager: DetailedWager;
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { wager } = this.props;
    const validWager = wager.amount > 0 && !wager.amended;

    return (
      <Table.Row
        positive={validWager}
        negative={!validWager}
      >
        <Table.Cell>
          <Header as='h4' image>
            {wager.avatar &&
              <Image
                src={`https://cdn.discordapp.com/avatars/${wager.user_id}/${wager.avatar}.png`}
                rounded
                size='mini'
              />
            }
            <Header.Content>
              {wager.username}
              <Header.Subheader>
                {wager.discriminator}
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{wager.amount || "Removed Wager"}</Table.Cell>
        <Table.Cell>{wager.time_placed}</Table.Cell>
      </Table.Row>
    );
  }
}
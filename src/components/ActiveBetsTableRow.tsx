import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Label, Popup, Table } from "semantic-ui-react";
import { ActiveBet } from "../lib/v1";

interface Props {
  activeBet: ActiveBet;
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { activeBet } = this.props;

    return (
      <Table.Row key={activeBet.id}>
        <Table.Cell>
          {activeBet.description.length > 0 &&
            <Popup
              content={activeBet.description}
              trigger={<span>{activeBet.name}</span>}
            />
          }
          {activeBet.description.length === 0 &&
            <span>{activeBet.name}</span>
          }
        </Table.Cell>
        <Table.Cell>
          {activeBet.betters.map(better => {
            return (
              <Label key={better.id} as='a' image>
                {better.avatar &&
                  <img src={`https://cdn.discordapp.com/avatars/${better.id}/${better.avatar}.png`} />
                }
                {better.username}#{better.discriminator}
              </Label>
            );
          })}
        </Table.Cell>
        <Table.Cell>{activeBet.wagers}</Table.Cell>
        <Table.Cell>
          <Link to={`/bets/${activeBet.id}`}>
            <Button>View</Button>
          </Link>
        </Table.Cell>
      </Table.Row>
    );
  }
}

import React, { Component } from "react";
import { Button, Popup, Table } from "semantic-ui-react";
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
        <Table.Cell></Table.Cell>
        <Table.Cell>{activeBet.wagers}</Table.Cell>
        <Table.Cell>
          <Button>View</Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

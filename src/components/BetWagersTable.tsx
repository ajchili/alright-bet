import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import { DetailedWager } from "../lib/v1";
import BetWagersTableRow from "./BetWagersTableRow";

interface Props {
  wagers: DetailedWager[];
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { wagers } = this.props;

    return (
      <Table basic="very" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Better</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {wagers.map(wager => {
            return <BetWagersTableRow key={wager.id} wager={wager} />;
          })}
        </Table.Body>
      </Table>
    );
  }
}
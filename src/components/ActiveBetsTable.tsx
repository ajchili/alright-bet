import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import { ActiveBet } from "../lib/v1";
import ActiveBetsTableRow from "./ActiveBetsTableRow";

interface Props {
  activeBets: ActiveBet[];
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { activeBets } = this.props;

    return (
      <Table basic="very" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Betters</Table.HeaderCell>
            <Table.HeaderCell># of Wagers</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {activeBets.map(activeBet => {
            return <ActiveBetsTableRow activeBet={activeBet} />;
          })}
        </Table.Body>
      </Table>
    );
  }
}

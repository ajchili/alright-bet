import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { Bet, User } from "../../lib/v1";
import BetOverview from "../components/BetOverview";

interface Props {
  me: User | null;
  bet: Bet | number;
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { bet, me } = this.props;

    return (
      <Grid padded="horizontally" columns={2}>
        <Grid.Row>
          <Grid.Column width={4} />
          <Grid.Column width={8}>
            <BetOverview bet={bet} me={me} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
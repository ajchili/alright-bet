import React, { Component } from "react";
import { Grid, Segment } from "semantic-ui-react";
import { User } from "../lib/v1";

interface Props {
  me: User | null;
}

export default class extends Component<Props> {
  render(): JSX.Element {
    return (
      <Grid padded="horizontally" columns={2}>
        <Grid.Row>
          <Grid.Column width={4} />
          <Grid.Column width={8}>
            <Segment />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
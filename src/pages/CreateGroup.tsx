import React, { Component } from "react";
import { Button, Grid, Header, Input } from "semantic-ui-react";

export default class extends Component {
  render(): JSX.Element {
    return (
      <Grid>
        <Grid.Row divided={false} />
        <Grid.Row columns={3} divided={false}>
          <Grid.Column />
          <Grid.Column textAlign="center" verticalAlign="middle">
            <Grid>
              <Grid.Row>
                <Grid.Column textAlign="center" verticalAlign="middle">
                  <Header>Create New Group</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row stretched>
                <Grid.Column
                  stretched
                  textAlign="center"
                  verticalAlign="middle"
                >
                  <Input placeholder="Group Name" />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column textAlign="center" verticalAlign="middle">
                  <Button>Create</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
        <Grid.Row divided={false} />
      </Grid>
    );
  }
}

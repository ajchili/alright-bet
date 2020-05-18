import React, { Component } from "react";
import { Button, Icon, Grid } from "semantic-ui-react";

export default class extends Component {
  render(): JSX.Element {
    return (
      <Grid style={{ width: "100%", height: "100vh" }}>
        <Grid.Row divided={false} />
        <Grid.Row columns={3} divided={false}>
          <Grid.Column />
          <Grid.Column textAlign="center" verticalAlign="middle">
            <h1>alright bet</h1>
            <p>An easy way to competitively track and compare performance between friends with fake money.</p>
            <a href="/api/v1/authentication/authenticate">
              <Button animated>
                <Button.Content visible>Login With Discord</Button.Content>
                <Button.Content hidden>
                  <Icon name="arrow right" />
                </Button.Content>
              </Button>
            </a>
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
        <Grid.Row divided={false} />
      </Grid>
    );
  }
}

import React, { Component } from "react";
import { Link } from "react-router-dom";
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
            <Link to="/api/v1/authentication/authenticate">
              <Button animated>
                <Button.Content visible>Login With Discord</Button.Content>
                <Button.Content hidden>
                  <Icon name="arrow right" />
                </Button.Content>
              </Button>
            </Link>
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
        <Grid.Row divided={false} />
      </Grid>
    );
  }
}

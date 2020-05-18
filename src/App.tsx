import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { User } from "./lib/v1/discord";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Lander from "./pages/Lander";

interface Props {
  me?: User;
}

export default class extends Component<Props> {
  render(): JSX.Element | null {
    const { me = null } = this.props;
    const authenticated = me !== null;

    return (
      <Grid stretched>
        {me !== null && (
          <Grid.Row>
            <Grid.Column>
              <Navbar me={me} />
            </Grid.Column>
          </Grid.Row>
        )}
        <Grid.Row>
          <Grid.Column stretched>
            <Switch>
              {!authenticated && <Route path="/" exact component={Lander} />}
              {authenticated && <Route path="/" exact component={Home} />}
            </Switch>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

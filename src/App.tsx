import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { User, Group } from "./lib/v1";
import Navbar from "./components/Navbar";
import CreateGroup from "./pages/CreateGroup";
import Home from "./pages/Home";
import JoinGroup from "./pages/JoinGroup";
import Lander from "./pages/Lander";

interface Props {
  groups?: Group[];
  me?: User;
}

export default class extends Component<Props> {
  render(): JSX.Element | null {
    const { groups = [], me = null } = this.props;
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
              {!authenticated && <Route path="/" component={Lander} />}
              {authenticated &&
                <Route path="/" exact>
                  <Home groups={groups} />
                </Route>
              }
              {authenticated && <Route path="/groups/create" exact component={CreateGroup} />}
              {authenticated && <Route path="/groups/join" exact component={JoinGroup} />}
            </Switch>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

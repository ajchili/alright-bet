import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { User, Group } from "./lib/v1";
import Navbar from "./components/Navbar";
import Bet from "./pages/Bet";
import CreateBet from "./pages/CreateBet";
import CreateGroup from "./pages/CreateGroup";
import Home from "./pages/Home";
import Lander from "./pages/Lander";

interface Props {
  groups?: Group[];
  me?: User;
}

export default class extends Component<Props> {
  render(): JSX.Element | null {
    const { groups = [], me = null } = this.props;

    return (
      <Grid stretched>
        <Switch>
          {me === null && <Route path="/" exact />}
          <Route path="/">
            <Grid.Row>
              <Grid.Column>
                <Navbar me={me} />
              </Grid.Column>
            </Grid.Row>
          </Route>
        </Switch>
        <Grid.Row>
          <Grid.Column stretched>
            <Switch>
              {me === null && <Route path="/" exact component={Lander} />}
              {me !== null &&
                <Route
                  path="/"
                  exact
                  render={(props) => {
                    const params = new URLSearchParams(props.location.search);
                    const group: number = parseInt(params.get("group") || "null", 10);
                    return <Home
                      groups={groups}
                      me={me}
                      selectedGroup={group || null}
                    />;
                  }}
                />
              }
              {me !== null &&
                <Route
                  path="/bets/create"
                  exact
                  render={(props => {
                    const params = new URLSearchParams(props.location.search);
                    const group: number = parseInt(params.get("group") || "null", 10);
                    if (isNaN(group)) {
                      return <Redirect to="/" />;
                    }
                    return <CreateBet group={group} />;
                  })}
                />
              }
              <Route
                path="/bets/:id"
                exact
                render={(props) => {
                  const { id = "null" } = props.match.params;
                  const bet: number = parseInt(id, 10);
                  if (isNaN(bet)) {
                    return <Redirect to="/" />;
                  }
                  return <Bet me={me} bet={bet} />;
                }}
              />
              {me !== null && <Route path="/groups/create" exact component={CreateGroup} />}
              {me !== null && <Route path="/groups/create" exact component={CreateGroup} />}
              <Route path="/">
                <Redirect to="/" />
              </Route>
            </Switch>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

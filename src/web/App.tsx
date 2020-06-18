import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { Bet, DetailedUser, User, Group } from "../lib/v1";
import Navbar from "./components/Navbar";
import Pages from "./pages";

interface Props {
  bet?: Bet;
  groups?: Group[];
  me?: User;
  usersPageData?: DetailedUser;
}

export default class extends Component<Props> {
  render(): JSX.Element | null {
    const { bet, groups = [], me = null, usersPageData } = this.props;

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
              {me === null && <Route path="/" exact component={Pages.Lander} />}
              {me !== null &&
                <Route
                  path="/"
                  exact
                  render={(props) => {
                    const params = new URLSearchParams(props.location.search);
                    const group: number = parseInt(params.get("group") || "null", 10);
                    return <Pages.Home
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
                    return <Pages.CreateBet group={group} />;
                  })}
                />
              }
              <Route
                path="/bets/:id"
                exact
                render={(props) => {
                  if (bet) {
                    return <Pages.Bet me={me} bet={bet} />;
                  }
                  const { id = "null" } = props.match.params;
                  const betId: number = parseInt(id, 10);
                  if (isNaN(betId)) {
                    return <Redirect to="/" />;
                  }
                  return <Pages.Bet me={me} bet={betId} />;
                }}
              />
              <Route
                path="/users/:id"
                exact
                render={(props) => {
                  if (usersPageData) {
                    return <Pages.User data={usersPageData} />;
                  }
                  const { id = "null" } = props.match.params;
                  const userId: number = parseInt(id, 10);
                  if (isNaN(userId)) {
                    return <Redirect to="/" />;
                  }
                  return <Pages.User id={id} />;
                }}
              />
              {me !== null && <Route path="/groups/create" exact component={Pages.CreateGroup} />}
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

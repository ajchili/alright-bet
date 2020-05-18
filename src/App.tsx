import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
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
      <Switch>
        {me !== null && <Route path="/" render={(props) => {
          return (
            <Navbar
              location={props.location}
              history={props.history}
              match={props.match}
              me={me} />
          );
        }} />}
        {!authenticated && <Route path="/" exact component={Lander} />}
        {authenticated && <Route path="/" exact component={Home} />}
      </Switch>
    );
  }
}

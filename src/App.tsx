import React, { Component } from "react";
import { StaticRouter as Router, Route, Switch } from "react-router-dom";
import { User } from "./lib/v1/discord";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Lander from "./pages/Lander";

interface Props {
  me?: User;
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { me = null } = this.props;
    const authenticated = me !== null;

    return (
      <Router>
        <Switch>
          {me && <Route path="/" render={(props) => {
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
      </Router>
    );
  }
}

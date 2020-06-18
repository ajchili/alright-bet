import React, { Component } from "react";
import { Header } from "semantic-ui-react";
import { DetailedUser } from "../../lib/v1";

interface Props {
  data?: DetailedUser;
}

export default class extends Component<Props> {

  render(): JSX.Element | null {
    const { data } = this.props;

    if (data === undefined || data.memberships.length > 0) {
      return null;
    }

    return (
      <Header as="h3">
        <Header.Content>
          {data.username} is currently not apart of any groups.
          <Header.Subheader>
            Consider making a group and adding {data.username} to it so that they can start betting some marbles!
          </Header.Subheader>
        </Header.Content>
      </Header>
    );
  }
}
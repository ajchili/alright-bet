import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import { Grid, Header, Image, Segment } from "semantic-ui-react";
import { DetailedUser } from "../lib/v1";

interface Props {
  data?: DetailedUser;
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { data } = this.props;

    return (
      <Header as="h2" image>
        {data !== undefined && data.avatar !== undefined &&
          <Image
            src={`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`}
            size="large"
            rounded
          />
        }
        <Header.Content>
          {data === undefined ? "Loading..." : data.username}
          <Header.Subheader>
            {data === undefined ? "Loading..." : data.discriminator}
          </Header.Subheader>
        </Header.Content>
      </Header>

    );
  }
}
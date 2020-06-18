import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Header, Image, Label, Popup } from "semantic-ui-react";
import { DetailedUser, DiscordUser, User } from "../../lib/v1";
import { Discord } from "../api/v1";

interface Props {
  size?: "small" | "regular";
  user: DiscordUser | DetailedUser | User;
}

export default class extends Component<Props> {
  _renderSmall = (): JSX.Element => {
    const { user } = this.props;

    return (
      <Label as='a' image>
        {user.avatar && <img src={Discord.getAvatarURL(user)} />}
        {user.username}#{user.discriminator}
      </Label>
    );
  };

  _renderNormal = (): JSX.Element => {
    const { user } = this.props;

    return (
      <Header as='h4' image>
        {user.avatar &&
          <Image
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
            rounded
            size='mini'
          />
        }
        <Header.Content>
          {user.username}
          <Header.Subheader>
            {user.discriminator}
          </Header.Subheader>
        </Header.Content>
      </Header>
    );
  };

  render(): JSX.Element {
    const { size = "regular", user } = this.props;

    return (
      <Popup
        content="Click to view profile"
        trigger={
          <Link to={`/users/${user.id}`}>
            {size === "small" ? this._renderSmall() : this._renderNormal()}
          </Link>
        }
      />
    );
  }
}

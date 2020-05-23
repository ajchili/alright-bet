import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Image, Menu } from "semantic-ui-react";
import { User } from "../lib/v1";

interface Props {
  me: User;
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { me } = this.props;

    return (
      <Menu>
        {me.avatar !== null &&
          <Menu.Item>
            <Image
              src={`https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png`}
              avatar />
          </Menu.Item>
        }
        <Menu.Item>
          <Link to="/">
            Home
          </Link>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            <a href="/api/v1/authentication/logout">
              Logout
            </a>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

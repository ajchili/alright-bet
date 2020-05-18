import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Image, Menu } from "semantic-ui-react";
import { User } from "../lib/v1/discord";

interface Props extends RouteComponentProps {
  me: User;
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { me } = this.props;

    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <Menu>
          {me.avatar !== null &&
            <Menu.Item>
              <Image
                src={`https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png`}
                avatar />
            </Menu.Item>
          }
          <Menu.Menu position='right'>
            <Menu.Item>
              <Link to="/api/v1/authentication/logout">
                Logout
              </Link>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

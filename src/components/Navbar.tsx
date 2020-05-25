import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Icon, Image, Menu } from "semantic-ui-react";
import { User } from "../lib/v1";

interface Props {
  me: User | null;
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { me } = this.props;

    return (
      <Menu>
        {me && me.avatar !== null &&
          <Menu.Item>
            <Image
              src={`https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png`}
              avatar />
          </Menu.Item>
        }
        {me &&
          <Menu.Item>
            <Link to="/">
              Home
            </Link>
          </Menu.Item>
        }
        <Menu.Item>
          <a
            href="https://github.com/ajchili/alright-bet/issues/new/choose"
            target="_blank"
          >
            Report bug or Request Feature
          </a>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            <a href="https://github.com/ajchili/alright-bet/" target="_blank">
              <Icon name="github" />
            </a>
          </Menu.Item>
          <Menu.Item>
            {me ? (
              <a href="/api/v1/authentication/logout">
                Logout
              </a>
            ) : (
                <Link to="/">
                  Login
                </Link>
              )
            }
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

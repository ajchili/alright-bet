import React, { Component } from "react";
import { Grid, Icon, Input, Menu } from "semantic-ui-react";
import { Group } from "../lib/v1";

interface Props {
  groups: Group[];
}
export default class extends Component<Props> {
  render(): JSX.Element {
    const { groups } = this.props;

    return (
      <Grid stretched padded="horizontally">
        <Grid.Row>
          <Grid.Column>
            <Menu vertical>
              <Menu.Item>
                <Menu.Header>Groups</Menu.Header>
                <Menu.Menu>
                  <a href="/groups/create">
                    <Menu.Item name="create">
                      <Icon name="add" />Create
                    </Menu.Item>
                  </a>
                  <a href="/groups/join">
                    <Menu.Item name="join">
                      <Icon name="sign in" />Join
                    </Menu.Item>
                  </a>
                </Menu.Menu>
                <Menu.Menu>
                  <Menu.Item>
                    <Input placeholder="Search..." />
                  </Menu.Item>
                  {groups.map((group: Group) =>
                    <Menu.Item key={group.id} name={group.name}>
                      {group.name}
                    </Menu.Item>
                  )}
                </Menu.Menu>
              </Menu.Item>
            </Menu>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

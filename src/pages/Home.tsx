import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Grid, Icon, Input, Menu } from "semantic-ui-react";
import { Group } from "../lib/v1";

interface Props {
  groups: Group[];
  selectedGroup: number | null;
}
export default class extends Component<Props> {
  _getSelectedGroup = (): Group | undefined => {
    const { groups, selectedGroup } = this.props;
    if (selectedGroup) {
      return groups.find(e => e.id === selectedGroup);
    }
    return undefined;
  };

  render(): JSX.Element {
    const { groups } = this.props;
    const selectedGroup: Group | undefined = this._getSelectedGroup();

    return (
      <Grid stretched padded="horizontally">
        <Grid.Row>
          <Grid.Column>
            <Menu vertical>
              <Menu.Item>
                <Menu.Header>Groups</Menu.Header>
                <Menu.Menu>
                  <Link to="/groups/create">
                    <Menu.Item name="create">
                      <Icon name="add" />Create
                    </Menu.Item>
                  </Link>
                  <Link to="/groups/join">
                    <Menu.Item name="join">
                      <Icon name="sign in" />Join
                    </Menu.Item>
                  </Link>
                </Menu.Menu>
                <Menu.Menu>
                  <Menu.Item>
                    <Input placeholder="Search..." />
                  </Menu.Item>
                  {groups.map((group: Group) =>
                    <Link key={group.id} to={`?group=${group.id}`}>
                      <Menu.Item name={group.name}>
                        {group.name}
                      </Menu.Item>
                    </Link>
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

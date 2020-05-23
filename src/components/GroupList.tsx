import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Icon, Input, Menu } from "semantic-ui-react";
import { Group } from "../lib/v1";

interface Props {
  groups: Group[];
  selectedGroup: number | null;
}

interface State {
  groupFilter: string;
}

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      groupFilter: ""
    };
  }

  _getFilteredGroups = (): Group[] => {
    const { groups } = this.props;
    const { groupFilter } = this.state;
    return groups.filter(group => {
      return group.name.toLowerCase().includes(groupFilter.toLowerCase());
    });
  }

  _getSelectedGroup = (): Group | undefined => {
    const { groups, selectedGroup } = this.props;
    if (selectedGroup) {
      return groups.find(e => e.id === selectedGroup);
    }
    return undefined;
  };

  render(): JSX.Element {
    const { groupFilter } = this.state;
    const groups: Group[] = this._getFilteredGroups();
    const selectedGroup: Group | undefined = this._getSelectedGroup();

    return (
      <Menu vertical>
        <Menu.Item>
          <Menu.Header>Groups</Menu.Header>
          <Menu.Menu>
            <Link to="/groups/create">
              <Menu.Item name="create">
                <Icon name="add" />
                Create
              </Menu.Item>
            </Link>
            <Link to="/groups/join">
              <Menu.Item name="join">
                <Icon name="sign in" />
                Join
              </Menu.Item>
            </Link>
          </Menu.Menu>
          <Menu.Menu>
            <Menu.Item>
              <Input
                placeholder="Search..."
                value={groupFilter}
                onChange={(e) => this.setState({ groupFilter: e.target.value })}
              />
            </Menu.Item>
            {groups.map((group: Group) => {
              const isActive = selectedGroup !== undefined && group.id === selectedGroup.id;
              return (
                <Link
                  key={group.id}
                  to={`?group=${group.id}`}
                  onClick={() => this.setState({ groupFilter: "" })}
                >
                  <Menu.Item
                    active={isActive}
                    name={group.name}
                  >
                    {group.name}
                  </Menu.Item>
                </Link>
              );
            }
            )}
          </Menu.Menu>
        </Menu.Item>
      </Menu >
    );
  }
}

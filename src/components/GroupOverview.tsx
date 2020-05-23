import React, { Component } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { Group, GroupMember, User } from "../lib/v1";

interface Props {
  group: Group;
  me: User;
}

interface State {
  loading: boolean;
  owner?: User;
  members: GroupMember[];
}

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      members: []
    };
    this._loadGroupData();
  }

  _deleteGroup = () => {
    const { group } = this.props;
    fetch(`/api/v1/groups/${group.id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(json => {
        const { redirect = "/" } = json;
        window.location.href = redirect;
      })
      .catch(console.error);
  };

  _loadGroupData = () => {
    Promise.all([this._loadGroupOwner(), this._loadGroupMembers()])
      .then(() => this.setState({ loading: false }));
  };

  _loadGroupOwner = () => {
    const { group } = this.props;
    return new Promise((resolve, reject) => {
      fetch(`/api/v1/groups/${group.id}/owner`)
        .then(response => response.json())
        .then(json => {
          const owner = json as User;
          this.setState({ owner }, resolve);
        })
        .catch(reject);
    });
  }

  _loadGroupMembers = () => {
    const { group } = this.props;
    return new Promise((resolve, reject) => {
      fetch(`/api/v1/groups/${group.id}/members`)
        .then(response => response.json())
        .then(json => {
          const members = json as GroupMember[];
          this.setState({ members }, resolve);
        })
        .catch(reject);
    });
  };

  render(): JSX.Element {
    const { group, me } = this.props;
    const { loading, owner } = this.state;

    return (
      <Segment loading={loading}>
        <Header>
          {group.name}
        </Header>
        {owner !== undefined && me.id === owner.id &&
          <Button
            color="red"
            onClick={this._deleteGroup}
          >
            Delete
          </Button>
        }
      </Segment>
    );
  }
}

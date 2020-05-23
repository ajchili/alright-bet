import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Header, Message, Segment } from "semantic-ui-react";
import { ActiveBet, Group, GroupMember, User } from "../lib/v1";
import ActiveBetsTable from "./ActiveBetsTable";

interface Props {
  group: Group;
  me: User;
}

interface State {
  activeBets: ActiveBet[];
  loading: boolean;
  owner?: User;
  members: GroupMember[];
}

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeBets: [],
      loading: true,
      members: []
    };
    this._loadGroupData();
  }

  componentWillReceiveProps(): void {
    this.setState({
      loading: true,
      owner: undefined,
      members: []
    }, this._loadGroupData);
  }

  _deleteGroup = () => {
    const { group } = this.props;
    if (confirm("Are your sure you want to delete this group?")) {
      this.setState({ loading: true });
      fetch(`/api/v1/groups/${group.id}`, {
        method: "DELETE"
      })
        .then(response => response.json())
        .then(json => {
          const { redirect = "/" } = json;
          window.location.href = redirect;
        })
        .catch(console.error);
    }
  };

  _leaveGroup = () => {
    const { group } = this.props;
    if (confirm("Are your sure you want to leave this group?")) {
      this.setState({ loading: true });
      fetch(`/api/v1/groups/${group.id}/leave`, {
        method: "POST"
      })
        .catch(console.error);
    }
  }

  _loadGroupData = () => {
    Promise.all([
      this._loadGroupAciveBets(),
      this._loadGroupOwner(),
      this._loadGroupMembers()
    ])
      .then(() => this.setState({ loading: false }));
  };

  _loadGroupAciveBets = () => {
    const { group } = this.props;
    return new Promise((resolve, reject) => {
      fetch(`/api/v1/groups/${group.id}/bets`)
        .then(response => response.json())
        .then(json => {
          const activeBets: ActiveBet[] = json as ActiveBet[];
          this.setState({ activeBets }, resolve);
        })
        .catch(reject);
    });
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

  _shareGroup = () => {
    const { group } = this.props;
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.value = `${window.location.host}/api/v1/groups/${group.id}/join`;
    input.focus();
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  };

  render(): JSX.Element {
    const { group, me } = this.props;
    const { activeBets, loading, owner } = this.state;

    return (
      <Segment loading={loading}>
        <Header as="h1">
          {group.name}
        </Header>
        <Button.Group>
          <Button onClick={this._shareGroup}>Share</Button>
          {owner !== undefined && me.id === owner.id &&
            <Button
              attached="right"
              color="red"
              onClick={this._deleteGroup}
            >
              Delete
            </Button>
          }
          {owner !== undefined && me.id !== owner.id &&
            <Button
              color="red"
              onClick={this._leaveGroup}
            >
              Leave
            </Button>
          }
        </Button.Group>
        <Header>Active Bets</Header>
        {activeBets.length > 0 &&
          <ActiveBetsTable activeBets={activeBets} />
        }
        {activeBets.length === 0 &&
          <Message>
            <Message.Header>There are currently no active bets</Message.Header>
            <p>
              You can start betting by clicking the "Make a bet" button below.
            </p>
          </Message>
        }
        <Link to={`/bets/create?group=${group.id}`}>
          <Button color="green">Make a bet</Button>
        </Link>
      </Segment>
    );
  }
}

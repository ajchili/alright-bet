import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Header, Message, Popup, Segment } from "semantic-ui-react";
import { ActiveBet, DetailedWager, Group, GroupMember, User } from "../lib/v1";
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
  }

  componentDidMount(): void {
    if (typeof window !== "undefined") {
      this._loadGroupData();
    }
  }

  componentWillReceiveProps(): void {
    this.setState({
      activeBets: [],
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
      this._loadGroupActiveBets(),
      this._loadGroupOwner(),
      this._loadGroupMembers()
    ])
      .then(() => this.setState({ loading: false }));
  };

  _loadGroupActiveBets = () => {
    const { group } = this.props;
    return new Promise((resolve, reject) => {
      fetch(`/api/v1/groups/${group.id}/bets`)
        .then(response => response.json())
        .then(json => {
          const activeBets: ActiveBet[] = json as ActiveBet[];
          return activeBets;
        })
        .then(activeBets => {
          const wagerPromises = activeBets.map((activeBet: ActiveBet, i: number) => {
            return new Promise((resolve, reject) => {
              this._loadGroupActiveBetWagers(activeBet)
                .then(wagers => {
                  const betterIds = new Set(wagers.map(wager => wager.user_id));
                  activeBets[i].betters = Array.from(betterIds).map(id => {
                    const wager = wagers.find(e => e.user_id === id);
                    return {
                      id: wager!.user_id,
                      username: wager!.username,
                      discriminator: wager!.discriminator,
                      avatar: wager!.avatar
                    };
                  });
                  activeBets[i].wagers = wagers.length;
                  resolve();
                })
                .catch(reject);
            });
          });
          Promise.all(wagerPromises)
            .then(() => this.setState({ activeBets }, resolve))
            .catch(reject);
        })
        .catch(reject);
    });
  };

  _loadGroupActiveBetWagers = (bet: ActiveBet): Promise<DetailedWager[]> => {
    return new Promise((resolve, reject) => {
      fetch(`/api/v1/bets/${bet.id}/wagers`)
        .then(response => response.json())
        .then(json => {
          const detailedWagers: DetailedWager[] = json as DetailedWager[];
          resolve(detailedWagers);
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
    input.value = `${window.location.protocol}//${window.location.host}/api/v1/groups/${group.id}/join`;
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
          <Popup
            content={"Click to copy the link to this group to your clipboard."}
            trigger={<Button onClick={this._shareGroup}>Share</Button>}
          />
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

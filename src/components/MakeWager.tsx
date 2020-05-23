import React, { Component } from "react";
import { Button, Input, Grid, Message } from "semantic-ui-react";
import { Member, User } from "../lib/v1";

interface Props {
  me: User | null;
  groupId: number;
}

interface State {
  loading: boolean;
  membership: Member | null;
  wager: number;
}

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      membership: null,
      wager: 1
    };
  }

  componentDidMount(): void {
    const { me } = this.props;
    if (typeof window !== 'undefined' && me !== null) {
      this._loadMembership();
    }
  }

  _loadMembership = () => {
    const { groupId } = this.props;
    fetch(`/api/v1/groups/${groupId}/membershipStatus`)
      .then(response => response.json())
      .then(json => {
        this.setState({ membership: json as Member });
      })
      .catch(console.error);
  };

  _getMarbles = (): number => {
    const { membership } = this.state;
    let marbles = 0;
    if (membership) {
      marbles = parseFloat(membership.currency.substring(1));
      if (isNaN(marbles)) {
        marbles = 0;
      }
    }
    return marbles;
  }

  _updateWager = (wager: string) => {
    const marbles = this._getMarbles();
    const _wager = parseFloat(wager);
    if (_wager < 1) {
      this.setState({ wager: 1 });
    } else if (_wager > marbles) {
      this.setState({ wager: marbles });
    } else {
      this.setState({ wager: _wager });
    }
  };

  _submitWager = () => {
    const { wager } = this.state;
    this.setState({ loading: true });
  }

  _renderWager = (): JSX.Element => {
    const { loading, wager } = this.state;
    const marbles = this._getMarbles();

    return (
      <Message>
        <Message.Header>Make a Wager</Message.Header>
        <Message.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <p>
                  You have {marbles || "an unknown amount"} marble(s). You can make a wager up to {marbles || "an unknown amount"} marble(s).
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Input
                  placeholder="Number of Marbles to Wager"
                  type="number"
                  disabled={loading}
                  min={1}
                  max={marbles}
                  value={wager}
                  onChange={(e) => this._updateWager(e.target.value)}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Button
                  loading={loading}
                  color="green"
                  onClick={this._submitWager}
                >
                  Make a Wager
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Message.Content>
      </Message>
    );
  };

  _renderNoMarblesMessage = (): JSX.Element => {
    return (
      <Message>
        <Message.Header>You cannot make a wager</Message.Header>
        <Message.Content>You are all out of marbles.</Message.Content>
      </Message>
    );
  };

  _renderLoadingMessage = (): JSX.Element => {
    return (
      <Message>
        <Message.Header>Loading marbles...</Message.Header>
      </Message>
    );
  };

  _renderUnauthenticatedMessage = (): JSX.Element => {
    return (
      <Message>
        <Message.Header>You cannot make a wager</Message.Header>
        <Message.Content>To make a wager, please login.</Message.Content>
      </Message>
    );
  }

  render(): JSX.Element {
    const { me } = this.props;
    const { membership } = this.state;
    const marbles = this._getMarbles();

    if (me === null) {
      return this._renderUnauthenticatedMessage();
    } else {
      if (membership === null) {
        return this._renderLoadingMessage();
      } else if (marbles > 0) {
        return this._renderWager();
      } else {
        return this._renderNoMarblesMessage();
      }
    }
  }
}
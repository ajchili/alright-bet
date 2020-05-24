import React, { Component } from "react";
import { Button, Header, Image, Message, Popup, Segment } from "semantic-ui-react";
import { Bet, DetailedWager, User } from "../lib/v1";
import BetWagersTable from "./BetWagersTable";
import MakeWager from "./MakeWager";

interface Props {
  me: User | null;
  bet: Bet | number;
}

interface State {
  bet: Bet | null;
  loading: boolean;
  wagers: DetailedWager[];
}

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      bet: this._getBet(),
      wagers: []
    };
  }

  componentDidMount(): void {
    if (typeof window !== 'undefined') {
      this._loadBetData();
    }
  }

  _getBet = (): Bet | null => {
    return typeof this.props.bet === "number" ? null : this.props.bet;
  }

  _getPreviousWager = (): number | undefined => {
    const { me } = this.props;
    if (!me) {
      return;
    }
    const { wagers } = this.state;
    const wager = wagers.find(e => e.user_id === me.id);
    if (wager) {
      return wager.amount;
    } else {
      return;
    }
  }

  _loadBetData = () => {
    Promise.all([this._loadBet(), this._loadWagers()])
      .then(() => this.setState({ loading: false }))
      .catch(console.error);
  };

  _loadBet = () => {
    const { bet } = this.props;
    const id = typeof bet === "number" ? bet : bet.id;
    return new Promise((resolve, reject) => {
      fetch(`/api/v1/bets/${id}`)
        .then(response => response.json())
        .then(json => {
          this.setState({ bet: json as Bet }, resolve);
        })
        .catch(reject);
    });
  }

  _loadWagers = () => {
    const { bet } = this.props;
    const id = typeof bet === "number" ? bet : bet.id;
    return new Promise((resolve, reject) => {
      fetch(`/api/v1/bets/${id}/wagers`)
        .then(response => response.json())
        .then(json => {
          this.setState({ wagers: json as DetailedWager[] }, resolve);
        })
        .catch(reject);
    });
  }

  _shareBet = () => {
    const bet = this._getBet();
    if (bet === null) {
      return;
    }
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.value = `${window.location.protocol}//${window.location.host}/bets/${bet.id}`;
    input.focus();
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  };

  render(): JSX.Element {
    const { me } = this.props;
    const {
      bet = this._getBet(),
      loading,
      wagers
    } = this.state;

    return (
      <Segment loading={loading}>
        {bet ? (
          <div>
            <Header as="h1">
              {bet.name}
            </Header>
            {bet.description &&
              <p>
                {bet.description}
              </p>
            }
            <Button.Group>
              <Popup
                content={"Click to copy the link to this bet to your clipboard."}
                trigger={<Button onClick={this._shareBet}>Share</Button>}
              />
              {me !== null && me.id === bet.creator_id &&
                <Button color="green">
                  Mark as Completed
                </Button>
              }
            </Button.Group>
          </div>
        ) : (
            <div>
              <Header as="h1">
                Loading bet...
              </Header>
              <p>
                Loading bet...
              </p>
            </div>
          )}
        <Header>Wagers</Header>
        {wagers.length > 0 && <BetWagersTable wagers={wagers} />}
        {wagers.length === 0 &&
          <Message>
            <Message.Header>There are currently no active wagers</Message.Header>
          </Message>
        }
        {bet &&
          <MakeWager
            bet={bet}
            me={me}
            groupId={bet.group_id}
            previousWager={this._getPreviousWager()}
          />
        }
      </Segment>
    );
  }
}
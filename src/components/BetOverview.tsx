import React, { Component } from "react";
import {
  Button,
  Grid,
  Header,
  Image,
  Message,
  Popup,
  Segment
} from "semantic-ui-react";
import { Bet, DetailedWager, User } from "../lib/v1";
import BetWagersTable from "./BetWagersTable";
import CompleteWagerMessage from "./CompleteWagerMessage";
import MakeWager from "./MakeWager";

interface Props {
  me: User | null;
  bet: Bet | number;
}

interface State {
  bet: Bet | null;
  loading: boolean;
  showCompleteDialog: boolean;
  wagers: DetailedWager[];
}

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      bet: this._getBet(),
      showCompleteDialog: false,
      wagers: []
    };
  }

  componentDidMount(): void {
    if (typeof window !== 'undefined') {
      this._loadBetData();
    }
  }

  _getBet = (): Bet | null => {
    const { bet = this.state.bet } = this.props;
    return typeof bet === "number" ? null : bet;
  }

  _getBetters = (): User[] => {
    const { wagers } = this.state;
    return [
      ...new Set(
        wagers
          .map(wager => {
            return {
              id: wager.user_id,
              username: wager.username,
              discriminator: wager.discriminator,
              avatar: wager.avatar
            };
          })
          .map(user => JSON.stringify(user))
      )
    ].map(s => JSON.parse(s) as User);
  };

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
      showCompleteDialog,
      wagers
    } = this.state;

    const isCompleted = bet !== null && bet.winner_id !== null;
    const isBetCreator = me !== null && bet !== null && me.id === bet.creator_id;
    let winner: User | undefined;
    if (bet !== null && bet.winner_id !== null) {
      winner = this._getBetters().find(user => user.id === bet.winner_id);
    }

    return (
      <Segment loading={loading}>
        {bet ? (
          <div>
            <Header as="h1">{bet.name}</Header>
            {bet.description && <p>{bet.description}</p>}
            <Button.Group>
              <Popup
                content={"Click to copy the link to this bet to your clipboard."}
                trigger={<Button onClick={this._shareBet}>Share</Button>}
              />
              {isBetCreator && !showCompleteDialog && !isCompleted &&
                <Button
                  color="green"
                  onClick={() => this.setState({ showCompleteDialog: true })}
                >
                  Mark as Completed
                </Button>
              }
            </Button.Group>
            {isBetCreator && showCompleteDialog &&
              <CompleteWagerMessage
                bet={bet}
                betters={this._getBetters()}
                onCancel={() => this.setState({ showCompleteDialog: false })}
              />
            }
          </div>
        ) : (
            <div>
              <Header as="h1">Loading bet...</Header>
              <p>Loading bet...</p>
            </div>
          )}
        {isCompleted && winner !== undefined &&
          <Message>
            <Message.Header>Winner</Message.Header>
            <Message.Content>
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <Header as='h4' image>
                      {winner.avatar &&
                        <Image
                          src={`https://cdn.discordapp.com/avatars/${winner.id}/${winner.avatar}.png`}
                          rounded
                          size='mini'
                        />
                      }
                      <Header.Content>
                        {winner.username}
                        <Header.Subheader>
                          {winner.discriminator}
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Grid.Column>
                </Grid.Row>
                {bet && bet.proof &&
                  <Image src={bet.proof} rounded size="medium" />
                }
              </Grid>
            </Message.Content>
          </Message>
        }
        <Header>Wagers</Header>
        {wagers.length > 0 && <BetWagersTable wagers={wagers} />}
        {wagers.length === 0 &&
          <Message>
            <Message.Header>There are currently no active wagers</Message.Header>
          </Message>
        }
        {bet && !isCompleted &&
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
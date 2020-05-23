import React, { Component } from "react";
import { Button, Header, Message, Segment, Table } from "semantic-ui-react";
import { Bet, User, Wager } from "../lib/v1";
import MakeWager from "./MakeWager";

interface Props {
  me: User | null;
  bet: Bet | number;
}

interface State {
  bet: Bet | null;
  loading: boolean;
  wagers: Wager[];
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

  _loadBetData = () => {
    Promise.all([this._loadBet()])
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
              <Button>Share</Button>
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
        {wagers.length > 0 &&
          <Table basic="very" celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Better</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            </Table.Body>
          </Table>
        }
        {wagers.length === 0 &&
          <Message>
            <Message.Header>There are currently no active wagers</Message.Header>
          </Message>
        }
        {bet && <MakeWager bet={bet} me={me} groupId={bet.group_id} />}
      </Segment>
    );
  }
}
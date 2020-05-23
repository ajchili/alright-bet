import React, { Component } from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
import { Bet, User } from "../lib/v1";

interface Props {
  me: User | null;
  bet: number;
}

interface State {
  bet?: Bet;
  loading: boolean;
}

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true
    };
    this._loadBetData();
  }

  _loadBetData = () => {
    Promise.all([this._loadBet()])
      .then(() => this.setState({ loading: false }))
      .catch(console.error);
  };

  _loadBet = () => {
    const { bet: id } = this.props;
    return new Promise((resolve, reject) => {
      fetch(`/api/v1/bets/${id}`)
        .then(response => response.json())
        .then(json => {
          const bet = json as Bet;
          this.setState({ bet }, resolve);
        })
        .catch(reject);
    });
  }

  render(): JSX.Element {
    const { loading, bet } = this.state;

    return (
      <Grid padded="horizontally" columns={2}>
        <Grid.Row>
          <Grid.Column width={4} />
          <Grid.Column width={8}>
            <Segment loading={loading}>
              {!bet &&
                <div>
                  <Header as="h1">
                    Loading bet...
                  </Header>
                  <span>
                    Loading bet...
                  </span>
                </div>
              }
              {bet &&
                <div>
                  <Header as="h1">
                    {bet.name}
                  </Header>
                  {bet.description &&
                    <span>
                      {bet.description}
                    </span>
                  }
                </div>
              }
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
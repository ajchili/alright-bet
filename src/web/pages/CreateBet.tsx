import React, { Component } from "react";
import { Button, Grid, Header, Input } from "semantic-ui-react";

interface Props {
  group: number;
}

interface State {
  creatingBet: boolean;
  name: string;
  description: string;
}

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      creatingBet: false,
      name: "",
      description: ""
    };
  }

  _canCreateBet = (): boolean => {
    const { name } = this.state;
    return name.length >= 3 && name.length <= 100;
  }

  _createBet = () => {
    const { group } = this.props;
    const { name, description } = this.state;
    this.setState({ creatingBet: true });
    fetch("/api/v1/bets/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupId: group,
        name,
        description
      })
    })
      .then(response => response.json())
      .then(json => {
        const { redirect = "/" } = json;
        window.location.href = redirect;
      })
      .catch(console.error);
  };

  render(): JSX.Element {
    const { creatingBet, name, description } = this.state;

    return (
      <Grid>
        <Grid.Row divided={false} />
        <Grid.Row columns={3} divided={false}>
          <Grid.Column />
          <Grid.Column textAlign="center" verticalAlign="middle">
            <Grid>
              <Grid.Row>
                <Grid.Column textAlign="center" verticalAlign="middle">
                  <Header>Make a bet</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row stretched>
                <Grid.Column
                  stretched
                  textAlign="center"
                  verticalAlign="middle"
                >
                  <Input
                    placeholder="Bet Name"
                    value={name}
                    disabled={creatingBet}
                    onChange={(event) => {
                      this.setState({ name: event.target.value });
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row stretched>
                <Grid.Column
                  stretched
                  textAlign="center"
                  verticalAlign="middle"
                >
                  <Input
                    placeholder="Bet Description"
                    value={description}
                    disabled={creatingBet}
                    onChange={(event) => {
                      this.setState({ description: event.target.value });
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column textAlign="center" verticalAlign="middle">
                  <Button
                    disabled={!this._canCreateBet()}
                    loading={creatingBet}
                    onClick={this._createBet}
                  >
                    Make a bet
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
        <Grid.Row divided={false} />
      </Grid>
    );
  }
}
import React, { Component } from "react";
import {
  Button,
  Dropdown,
  Grid,
  Input,
  Message,
  Popup
} from "semantic-ui-react";
import { Bet, User } from "../../lib/v1";

interface Props {
  bet: Bet;
  betters: User[];
  onCancel?: () => void;
}

interface State {
  loading: boolean;
  selectedBetter?: string;
  proof?: File;
}

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  _submit = () => {
    const { bet } = this.props;
    const { selectedBetter, proof } = this.state;
    if (selectedBetter === undefined) {
      return;
    }
    this.setState({ loading: true });
    const body = new FormData();
    body.append("winner_id", selectedBetter);
    if (proof !== undefined) {
      body.append("proof", proof);
    }
    fetch(`/api/v1/bets/${bet.id}/complete`, {
      method: "POST",
      body
    })
      .then(response => response.json())
      .then(json => {
        const { redirect = "/" } = json;
        window.location.href = redirect;
      })
      .catch(console.error);
  };

  render(): JSX.Element {
    const {
      betters,
      onCancel = () => console.warn("[CompleteWagerMessage] onCancel is not implemented!")
    } = this.props;
    const { loading, selectedBetter } = this.state;

    return (
      <Message>
        <Message.Header>Complete Bet</Message.Header>
        <Message.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <p>
                  Please select the winner and provide an image as proof if necessary.
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Dropdown
                  clearable
                  placeholder="Select Winner"
                  fluid
                  selection
                  disabled={loading}
                  value={selectedBetter}
                  onChange={(_, { value }) => {
                    const newSelectedBetter = typeof value === "string" ? value : undefined;
                    this.setState({ selectedBetter: newSelectedBetter });
                  }}
                  options={betters.map((user: User) => {
                    return {
                      key: user.id,
                      value: user.id,
                      text: `${user.username}#${user.discriminator}`,
                      image: {
                        avatar: user.avatar !== undefined,
                        src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                      }
                    };
                  })}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Popup
                  content="Proof (optional)"
                  trigger={
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={loading}
                      onChange={(e) => {
                        if (e.target.files === null) {
                          return;
                        }
                        const file: File | undefined = e.target.files[0] || undefined;
                        this.setState({ proof: file });
                      }}
                    />
                  }
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Button.Group>
                  <Button
                    color="green"
                    loading={loading}
                    disabled={selectedBetter === undefined}
                    onClick={this._submit}
                  >
                    Complete
                  </Button>
                  <Button
                    color="red"
                    loading={loading}
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </Button.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Message.Content>
      </Message>
    );
  }
}
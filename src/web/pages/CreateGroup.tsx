import React, { Component } from "react";
import { Button, Grid, Header, Input } from "semantic-ui-react";

interface State {
  creatingGroup: boolean;
  name: string;
}

export default class extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      creatingGroup: false,
      name: ""
    };
  }

  _createGroup = () => {
    const { name } = this.state;
    this.setState({ creatingGroup: true });
    fetch("/api/v1/groups/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    })
      .then(response => response.json())
      .then(json => {
        const { redirect = "/" } = json;
        window.location.href = redirect;
      })
      .catch(console.error)
      .finally(() => {
        this.setState({ creatingGroup: false });
      });
  };

  _canCreateGroup = (): boolean => {
    const { name } = this.state;
    return name.length >= 3 && name.length <= 100;
  }

  render(): JSX.Element {
    const { creatingGroup, name } = this.state;

    return (
      <Grid>
        <Grid.Row divided={false} />
        <Grid.Row columns={3} divided={false}>
          <Grid.Column />
          <Grid.Column textAlign="center" verticalAlign="middle">
            <Grid>
              <Grid.Row>
                <Grid.Column textAlign="center" verticalAlign="middle">
                  <Header>Create New Group</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row stretched>
                <Grid.Column
                  stretched
                  textAlign="center"
                  verticalAlign="middle"
                >
                  <Input
                    placeholder="Group Name"
                    value={name}
                    disabled={creatingGroup}
                    onChange={(event) => {
                      this.setState({ name: event.target.value });
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column textAlign="center" verticalAlign="middle">
                  <Button
                    disabled={!this._canCreateGroup()}
                    loading={creatingGroup}
                    onClick={this._createGroup}
                  >
                    Create
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

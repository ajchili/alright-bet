import React, { Component } from "react";
import { Grid, Header, Image, Segment } from "semantic-ui-react";
import { DetailedUser } from "../lib/v1";

interface Props {
  data?: DetailedUser;
  id?: string;
}

interface State {
  data?: DetailedUser;
}

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: props.data
    };
    if (!props.data) {
      this._loadUserData();
    }
  }

  _loadUserData = () => {
    const { id } = this.props;
    if (id === undefined) {
      return;
    }
    fetch(`/api/v1/users/${id}`)
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();
            break;
          default:
            break;
        }
      })
      .then(json => {
        const data = json as DetailedUser;
        this.setState({ data });
      })
      .catch(console.error);
  };

  render(): JSX.Element {
    const { data } = this.state;

    return (
      <div>
        <Grid padded="horizontally" columns={2}>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={8}>
              <Segment loading={data === undefined}>
                <Header as="h2" image>
                  {data !== undefined && data.avatar !== undefined &&
                    <Image
                      src={`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`}
                      size="large"
                      rounded
                    />
                  }
                  <Header.Content>
                    {data === undefined ? "Loading..." : data.username}
                    <Header.Subheader>
                      {data === undefined ? "Loading..." : data.discriminator}
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
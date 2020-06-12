import React, { Component } from "react";
import { Grid, Segment } from "semantic-ui-react";
import { Users } from "../api/v1";
import { DetailedUser } from "../../lib/v1";
import UserHeader from "../components/UserPageHeader";
import UserMarbleChart from "../components/UserPageMarbleChart";
import UserNoMembershipsHeader from "../components/UserPageNoMembershipsHeader";

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
  }

  componentDidMount(): void {
    const { data } = this.props;
    if (!data) {
      this._loadUserData();
    }
  }

  componentWillReceiveProps(): void {
    this.setState({ data: undefined }, this._loadUserData);
  }

  _loadUserData = () => {
    const { id } = this.props;
    if (id === undefined) {
      return;
    }
    Users.get(id)
      .then(data => this.setState({ data }))
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
                <UserHeader data={data} />
                <UserMarbleChart data={data} />
                <UserNoMembershipsHeader data={data} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
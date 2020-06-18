import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import { Header } from "semantic-ui-react";
import { DetailedUser, constants } from "../../lib/v1";

interface Props {
  data?: DetailedUser;
}

export default class extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  _getTotalMarbles = (): number => {
    const { data } = this.props;

    if (data === undefined || data.memberships.length === 0) {
      return 0;
    }

    return data.memberships
      .map(membership => membership.currency)
      .reduce((a, b) => a + b);
  }

  render(): JSX.Element | null {
    const { data } = this.props;

    if (data === undefined || data.memberships.length === 0) {
      return null;
    }

    return (
      <div>
        <Header as="h3">
          <Header.Content>Marbles</Header.Content>
          <Header.Subheader>
            {data.username} has a total of {this._getTotalMarbles()} marble(s) across {data.memberships.length} group(s)!
          </Header.Subheader>
        </Header>
        <Pie
          data={{
            datasets: [{
              backgroundColor: data.memberships.map((_, i) => {
                return constants.COLORS[i % constants.COLORS.length];
              }),
              data: data.memberships.map(membership => membership.currency),
              hoverBackgroundColor: "#767676"
            }],
            labels: data.memberships.map((_, i) => {
              return `Group ${i + 1}`;
            })
          }}
        />
      </div>
    );
  }
}
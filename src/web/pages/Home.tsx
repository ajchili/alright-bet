import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import GroupList from "../components/GroupList";
import GroupOverview from "../components/GroupOverview";
import { Group, User } from "../../lib/v1";

interface Props {
  groups: Group[];
  me: User;
  selectedGroup: number | null;
}

interface State {
  groups: Group[];
}

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      groups: props.groups
    };
  }

  componentDidMount(): void {
    const { groups } = this.props;
    if (typeof window !== "undefined" && groups.length === 0) {
      fetch("/api/v1/groups/mine")
        .then(response => response.json())
        .then(json => this.setState({ groups: json as Group[] }))
        .catch(console.error);
    }
  }

  render(): JSX.Element {
    const { me, selectedGroup } = this.props;
    const { groups } = this.state;
    const group = groups.find(e => e.id === selectedGroup);

    return (
      <Grid padded="horizontally" columns={2}>
        <Grid.Row>
          <Grid.Column width={4}>
            <GroupList groups={groups} selectedGroup={selectedGroup} />
          </Grid.Column>
          <Grid.Column width={8}>
            {group && <GroupOverview group={group} me={me} />}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import GroupList from "../components/GroupList";
import GroupOverview from "../components/GroupOverview";
import { Group, User } from "../lib/v1";

interface Props {
  groups: Group[];
  me: User;
  selectedGroup: number | null;
}
export default class extends Component<Props> {
  render(): JSX.Element {
    const { groups, me, selectedGroup } = this.props;
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

import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import GroupList from "../components/GroupList";
import { Group } from "../lib/v1";

interface Props {
  groups: Group[];
  selectedGroup: number | null;
}
export default class extends Component<Props> {

  render(): JSX.Element {
    const { groups, selectedGroup } = this.props;

    return (
      <Grid stretched padded="horizontally">
        <Grid.Row>
          <Grid.Column>
            <GroupList groups={groups} selectedGroup={selectedGroup} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

import React, { Component } from "react";
import { Button, Grid, Header, Segment } from "semantic-ui-react";
import GroupList from "../components/GroupList";
import { Group } from "../lib/v1";

interface Props {
  groups: Group[];
  selectedGroup: number | null;
}
export default class extends Component<Props> {
  _deleteGroup = (id: number) => {
    fetch(`/api/v1/groups/${id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(json => {
        const { redirect = "/" } = json;
        window.location.href = redirect;
      })
      .catch(console.error);
  };

  render(): JSX.Element {
    const { groups, selectedGroup } = this.props;
    const group = groups.find(e => e.id === selectedGroup);

    return (
      <Grid padded="horizontally" columns={2}>
        <Grid.Row>
          <Grid.Column width={4}>
            <GroupList groups={groups} selectedGroup={selectedGroup} />
          </Grid.Column>
          <Grid.Column width={8}>
            {group &&
              <Segment>
                <Header>
                  {group.name}
                </Header>
                <Button
                  color="red"
                  onClick={() => this._deleteGroup(group.id)}
                >
                  Delete
                </Button>
              </Segment>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

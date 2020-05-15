import React, { Component } from "react";

interface Props {
  token?: string;
}

export default class extends Component<Props> {
  render(): JSX.Element {
    const { token = "no token" } = this.props;

    return (
      <div>
        <p>
          {token}
        </p>
      </div>
    );
  }
}

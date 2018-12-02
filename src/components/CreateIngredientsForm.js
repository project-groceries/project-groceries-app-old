import React, { Component } from "react";
import { FieldTextStateless } from "@atlaskit/field-text";
import { css } from "emotion";

class CreateIngredients extends Component {
  state = {
    name: "Yolo",
    measurement: null,
    tags: [],
    description: ""
  };

  render() {
    const { name } = this.state;

    return (
      <div
        className={css`
          padding: 10px;
          box-shadow: rgba(0, 0, 0, 0.14) 0px 0px 2px 0;
        `}
      >
        <FieldTextStateless
          label="Recipe Name"
          placeholder="Give the recipe a name"
          onChange={e => this.setState({ name: e.target.value })}
          value={name}
          required
        />
      </div>
    );
  }
}

export default CreateIngredients;

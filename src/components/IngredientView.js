import React, { Component } from "react";

class IngredientView extends Component {
  render() {
    const { match } = this.props;
    const { id } = match.params;

    return (
      <div>
        <h1>Ingredient View</h1>
        <p>id: {id}</p>
      </div>
    );
  }
}

export default IngredientView;

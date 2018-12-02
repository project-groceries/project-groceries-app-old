import React, { Component } from "react";
import CreateIngredientsForm from "./CreateIngredientsForm";
import { css } from "emotion";

class CreateIngredients extends Component {
  // state = {
  //   ingredients: [{
  //     Name: ""
  //   }]
  // };

  render() {
    return (
      <div>
        <div
          className={css`
            // width: 100%;
            display: grid;
            grid-gap: 20px;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            // grid-auto-flow: column;
            // grid-auto-columns: 80%;

            transition: all 0.3s ease;
          `}
        >
          <CreateIngredientsForm />
          <CreateIngredientsForm />
          <CreateIngredientsForm />
          <CreateIngredientsForm />
          <CreateIngredientsForm />
          <CreateIngredientsForm />
          <CreateIngredientsForm />
          <CreateIngredientsForm />
          <CreateIngredientsForm />
          <CreateIngredientsForm />
          <CreateIngredientsForm />
          <CreateIngredientsForm />
        </div>
        <small>yolo</small>
      </div>
    );
  }
}

export default CreateIngredients;

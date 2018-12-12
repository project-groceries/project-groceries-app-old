import React, { Component } from "react";
import CreateIngredientsForm from "./CreateIngredientsForm";
import { createIngredientsGrid } from "../styles";
import Button from "@atlaskit/button";

import styled from "styled-components";
import { Add } from "styled-icons/material";
import { Mutation } from "react-apollo";
import {
  CREATE_INGREDIENTS_MUTATION,
  ORDER_INGREDIENT_QUERY,
  CLASS_VIEW_GRID_QUERY
} from "../queries";

const AddIcon = styled(Add)`
  height: 60px;
  fill: #d9d9d9;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-top: 30px;
`;

class CreateIngredients extends Component {
  state = {
    ingredients: [
      {
        name: "",
        measurement: "cjos1hvuf3bog0a16wrjjbshx"
      }
    ]
  };

  render() {
    const { onCompleted } = this.props;
    const { ingredients } = this.state;

    return (
      <div>
        <div className={createIngredientsGrid}>
          {ingredients.map((ingredient, index) => (
            <CreateIngredientsForm
              key={index}
              index={index}
              ingredient={ingredient}
              updateValue={this.updateValue}
              setMeasurement={this.setMeasurement}
              onlyIngredient={ingredients.length === 1}
              removeIngredient={this.removeIngredient}
            />
          ))}
          <div onClick={this.addIngredient}>
            <AddIcon />
          </div>
        </div>
        <ButtonContainer>
          <Mutation
            mutation={CREATE_INGREDIENTS_MUTATION}
            refetchQueries={[
              { query: ORDER_INGREDIENT_QUERY },
              { query: CLASS_VIEW_GRID_QUERY }
            ]}
            onCompleted={() => {
              if (onCompleted) onCompleted();
            }}
          >
            {(mutation, { loading, error }) => {
              if (error) return <div>Error</div>;

              return (
                <Button
                  appearance="primary"
                  isLoading={loading}
                  onClick={() => {
                    const properIngredients = ingredients
                      .filter(i => i.name.length > 0)
                      .map(ingredient => ({
                        name: ingredient.name,
                        measurement: { connect: { id: ingredient.measurement } }
                      }));

                    mutation({
                      variables: { ingredients: properIngredients }
                    });
                  }}
                >
                  Create Ingredients
                </Button>
              );
            }}
          </Mutation>
        </ButtonContainer>
      </div>
    );
  }

  updateValue = event => {
    const {
      value,
      dataset: { index, name }
    } = event.target;

    this.setState(prevState => {
      const { ingredients } = prevState;
      ingredients[index][name] = value;
      // this.setState({ name: e.target.value })

      return prevState;
    });
  };

  setMeasurement = (index, value) => {
    this.setState(prevState => {
      const { ingredients } = prevState;
      ingredients[index].measurement = value;

      return prevState;
    });
  };

  addIngredient = () => {
    this.setState(prevState => {
      prevState.ingredients.push({
        name: "",
        measurement: "cjos1hvuf3bog0a16wrjjbshx"
      });

      return prevState;
    });
  };

  removeIngredient = index => {
    this.setState(prevState => {
      prevState.ingredients.splice(index, 1);
      return prevState;
    });
  };
}

export default CreateIngredients;

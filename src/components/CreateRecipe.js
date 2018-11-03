import React, { Component, Fragment } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/lib/Async";
import { Query, Mutation } from "react-apollo";
import { CREATE_RECIPE_QUERY, CREATE_RECIPE_MUTATION } from "../queries";
import Spinner from "./Spinner";
import { css } from "emotion";
import styled from "styled-components";
import { Close } from "styled-icons/material";
import { FieldTextStateless } from "@atlaskit/field-text";
import Button from "@atlaskit/button";
import { withToastManager } from "react-toast-notifications";

const BlackClose = styled(Close)`
  color: black;
  width: 20px;
  margin: 5px;
  transition: all 0.3s ease;

  &:hover {
    cursor: pointer;
    transform: scale(2);
  }
`;

class CreateRecipe extends Component {
  state = { recipeName: "", recipeIngredients: new Map() };

  render() {
    const { recipeName, recipeIngredients } = this.state;

    return (
      <Query query={CREATE_RECIPE_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;

          if (error) return <div>Error</div>;

          const {
            ingredients,
            user: {
              school: { id: schoolId }
            }
          } = data;

          return (
            <div
              className={css`
                min-height: 400px;

                & > * {
                  margin-top: 10px;
                }
              `}
            >
              <FieldTextStateless
                label="Recipe Name"
                placeholder="Give the recipe a name"
                onChange={e => this.setState({ recipeName: e.target.value })}
                value={recipeName}
                required
              />
              {recipeName && (
                <Fragment>
                  <AsyncSelect
                    value=""
                    placeholder="Select an ingredient to add to the recipe"
                    maxMenuHeight={200}
                    loadOptions={(inputValue, callback) => {
                      callback(this.filterIngredients(inputValue, ingredients));
                    }}
                    onChange={data => {
                      if (data.value) {
                        this.setState(prev => ({
                          recipeIngredients: prev.recipeIngredients.set(
                            data.value,
                            {
                              ...data,
                              amount: 1
                            }
                          )
                        }));
                      }
                    }}
                  />
                  {recipeIngredients.size > 0 && (
                    <Fragment>
                      {[...recipeIngredients].map(
                        ([, { label, value, amount }]) => (
                          <div
                            key={value}
                            className={css`
                              display: flex;
                              justify-content: space-between;
                              align-items: center;

                              background-color: whitesmoke;
                              padding: 10px;

                              & > input {
                                width: 100px;
                              }
                            `}
                          >
                            <BlackClose
                              onClick={() =>
                                this.setState(prev => {
                                  prev.recipeIngredients.delete(value);
                                  return {
                                    recipeIngredients: prev.recipeIngredients
                                  };
                                })
                              }
                            />
                            <small>{label}</small>
                            <input
                              type="number"
                              min={0}
                              onChange={e => {
                                const { value: newAmount } = e.target;

                                this.setState(ps => ({
                                  recipeIngredients: ps.recipeIngredients.set(
                                    value,
                                    {
                                      label,
                                      value,
                                      amount: Number(newAmount) || ""
                                    }
                                  )
                                }));
                              }}
                              value={amount}
                              required={true}
                            />
                          </div>
                        )
                      )}
                      <Mutation
                        mutation={CREATE_RECIPE_MUTATION}
                        onCompleted={this.onCompleted}
                      >
                        {(mutation, { loading, error }) => {
                          if (error) return <div>Error</div>;

                          return (
                            <Button
                              appearance="primary"
                              onClick={() => {
                                const ingredients = [...recipeIngredients].map(
                                  ([id, ingredient]) => ({
                                    amount: ingredient.amount,
                                    ingredient: {
                                      connect: { id }
                                    }
                                  })
                                );

                                mutation({
                                  variables: {
                                    name: recipeName,
                                    schoolId,
                                    ingredients
                                  }
                                });
                              }}
                              isLoading={loading}
                            >
                              Create Recipe
                            </Button>
                          );
                        }}
                      </Mutation>
                    </Fragment>
                  )}
                </Fragment>
              )}
            </div>
          );
        }}
      </Query>
    );
  }

  onCompleted = async () => {
    const { toastManager, onCompleted } = this.props;

    window.mixpanel.track("Created a recipe");

    toastManager.add("Recipe created successfully", {
      appearance: "success",
      autoDismiss: true
    });

    if (onCompleted) onCompleted();
  };

  filterIngredients = (inputValue, ingredients) => {
    const { recipeIngredients } = this.state;

    return ingredients
      .filter(i => i.name.toLowerCase().includes(inputValue.toLowerCase()))
      .filter(i => !recipeIngredients.has(i.id))
      .map(i => ({ value: i.id, label: i.name }))
      .slice(0, inputValue.length > 2 ? undefined : 40); // reduce results for faster loading
  };
}

export default withToastManager(CreateRecipe);

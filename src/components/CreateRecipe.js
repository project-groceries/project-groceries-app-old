import React, { Component, Fragment } from "react";
import AsyncSelect from "react-select/lib/Async";
import { Query, Mutation } from "react-apollo";
import { CREATE_RECIPE_QUERY, CREATE_RECIPE_MUTATION } from "../queries";
import Spinner from "./Spinner";
import { css } from "emotion";
import styled from "styled-components";
import { Close } from "styled-icons/material";
import { FieldTextStateless } from "@atlaskit/field-text";
import Button from "@atlaskit/button";
import { FlagContext } from "../flag-context";
import { changesNotice } from "../utils";
import Select from "react-select";

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
                    defaultOptions
                    loadOptions={(inputValue, callback) => {
                      callback(this.filterIngredients(inputValue, ingredients));
                    }}
                    onChange={data => {
                      if (data.value) {
                        this.setState(prev => ({
                          recipeIngredients: prev.recipeIngredients.set(
                            data.value.id,
                            {
                              ...data.value,
                              amount: 1,
                              scale: data.value.measurement
                                ? this.getUnitScale(data.value.measurement)
                                : null
                            }
                          )
                        }));
                      }
                    }}
                  />
                  {recipeIngredients.size > 0 && (
                    <Fragment>
                      {[...recipeIngredients].map(
                        ([, { id, name, unit, amount, measurement }]) => (
                          <div
                            key={id}
                            className={css`
                              display: flex;
                              justify-content: space-between;
                              align-items: center;

                              background-color: whitesmoke;
                              padding: 10px;

                              & > div:last-child {
                                display: flex;
                                align-items: center;

                                & > input {
                                  width: 50px;
                                }

                                & > div {
                                  width: 150px;
                                  margin-left: 8px;
                                }
                              }
                            `}
                          >
                            <BlackClose
                              onClick={() =>
                                this.setState(prev => {
                                  prev.recipeIngredients.delete(id);
                                  return {
                                    recipeIngredients: prev.recipeIngredients
                                  };
                                })
                              }
                            />
                            <small>{name}</small>
                            <div>
                              <input
                                type="number"
                                min={0}
                                onChange={e => {
                                  const { value: newAmount } = e.target;

                                  this.setState(prevState => {
                                    const mapFiller = prevState.recipeIngredients.get(
                                      id
                                    );

                                    return {
                                      recipeIngredients: prevState.recipeIngredients.set(
                                        id,
                                        {
                                          ...mapFiller,
                                          amount: Number(newAmount) || ""
                                        }
                                      )
                                    };
                                  });
                                }}
                                value={amount}
                                required={true}
                              />
                              {unit && <small>{unit}</small>}
                              {measurement && (
                                <Select
                                  className="radio-select"
                                  classNamePrefix="react-select"
                                  maxMenuHeight={100}
                                  isSearchable={false}
                                  defaultValue={this.getUnitScale(measurement)}
                                  options={this.getScaleOptions(measurement)}
                                  onChange={data =>
                                    this.setScale(id, data.value)
                                  }
                                />
                              )}
                            </div>
                          </div>
                        )
                      )}
                      <FlagContext.Consumer>
                        {({ addFlag }) => (
                          <Mutation
                            mutation={CREATE_RECIPE_MUTATION}
                            onCompleted={() => this.onCompleted(addFlag)}
                          >
                            {(mutation, { loading, error }) => {
                              if (error) return <div>Error</div>;

                              return (
                                <Button
                                  appearance="primary"
                                  onClick={() => {
                                    const ingredients = [
                                      ...recipeIngredients
                                    ].map(([id, { amount, scale }]) => ({
                                      amount: amount * scale.amount,
                                      ingredient: {
                                        connect: { id }
                                      }
                                    }));

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
                        )}
                      </FlagContext.Consumer>
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

  filterIngredients = (inputValue, ingredients) => {
    const { recipeIngredients } = this.state;

    return ingredients
      .filter(i => i.name.toLowerCase().includes(inputValue.toLowerCase()))
      .filter(i => !recipeIngredients.has(i.id))
      .map(i => ({ value: i, label: i.name }))
      .slice(0, inputValue.length > 2 ? undefined : 40); // reduce results for faster loading
  };

  getScaleOptions = measurement => measurement.scales.map(this.scaleToOption);

  getUnitScale = measurement =>
    this.scaleToOption(this.getSpecificScale(measurement, 1));

  getSpecificScale = (measurement, amount) =>
    measurement.scales.find(s => s.amount === amount);

  scaleToOption = scale => ({ label: scale.name, value: scale.amount });

  setScale = (id, multiplier) => {
    this.setState(prevState => {
      const mapFiller = prevState.recipeIngredients.get(id);
      // console.log()

      return {
        recipeIngredients: prevState.recipeIngredients.set(id, {
          ...mapFiller,
          scale: this.getSpecificScale(mapFiller.measurement, multiplier)
        })
      };
    });
  };

  onCompleted = addFlag => {
    const { onCompleted } = this.props;

    window.mixpanel.track("Created a recipe");

    addFlag({
      type: "success",
      title: "Recipe created successfully",
      description: changesNotice
    });

    if (onCompleted) onCompleted();
  };
}

export default CreateRecipe;

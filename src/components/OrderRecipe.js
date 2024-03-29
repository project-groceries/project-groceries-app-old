import React, { Component, Fragment } from "react";
import { css } from "emotion";
import { Query, Mutation } from "react-apollo";
import {
  ORDER_RECIPE_QUERY,
  CREATE_ORDERS_MUTATION,
  ORDERS_QUERY,
  CLASS_VIEW_GRID_QUERY
} from "../queries";
import Spinner from "./Spinner";
import Select from "react-select";
import Button from "@atlaskit/button";
import { FlagContext } from "../flag-context";
import { changesNotice, massToVolume } from "../utils";

class OrderRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentClass: null,
      currentRecipe: null,
      selectedRecipe: null,
      servings: 1
    };
  }

  render() {
    const { currentClass } = this.props;

    const { currentRecipe, selectedRecipe, servings } = this.state;

    return (
      <Query query={ORDER_RECIPE_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;

          if (error) return <div>Error</div>;

          const { user, recipes } = data;

          return (
            <Fragment>
              <Select
                className="radio-select"
                classNamePrefix="react-select"
                isSearchable={false}
                value={selectedRecipe}
                options={recipes.map(r => ({
                  label: r.name,
                  value: r.id
                }))}
                placeholder="Select a recipe to order"
                onChange={data => {
                  if (data.value) {
                    this.setState({
                      selectedRecipe: data,
                      currentRecipe: recipes.find(r => r.id === data.value)
                    });
                  }
                }}
              />
              {currentRecipe && (
                <Fragment>
                  <div>
                    <h3>Servings</h3>
                    <div
                      className={css`
                        display: flex;
                        justify-content: space-around;

                        & > span {
                          width: 40px;
                          height: 40px;
                          border-radius: 50%;
                          background-color: whitesmoke;

                          display: flex;
                          justify-content: center;
                          align-items: center;

                          transition: all 0.3s ease;
                        }

                        & > span:hover {
                          cursor: pointer;
                          transform: scale(1.1);
                        }
                      `}
                    >
                      <span
                        onClick={() =>
                          this.setState(pp => ({
                            servings: pp.servings > 1 ? pp.servings - 1 : 1
                          }))
                        }
                      >
                        -
                      </span>
                      <p>{servings}</p>
                      <span
                        onClick={() =>
                          this.setState(pp => ({
                            servings: pp.servings + 1
                          }))
                        }
                      >
                        +
                      </span>
                    </div>
                  </div>
                  {currentRecipe.ingredients.map(
                    ({ id, amount, ingredient: { name, density }, scale }) => (
                      <div
                        key={id}
                        className={css`
                          display: flex;
                          justify-content: space-between;
                          align-items: center;

                          background-color: whitesmoke;
                          padding: 10px;
                        `}
                      >
                        <small>{name}</small>
                        {scale ? (
                          <small>
                            {scale.isMass
                              ? massToVolume(
                                  amount * servings,
                                  scale.amount,
                                  density
                                )
                              : (amount * servings) / scale.amount}{" "}
                            {scale.name}
                          </small>
                        ) : (
                          <small>{amount * servings}</small>
                        )}
                      </div>
                    )
                  )}
                  <FlagContext.Consumer>
                    {({ addFlag }) => (
                      <Mutation
                        mutation={CREATE_ORDERS_MUTATION}
                        refetchQueries={[
                          { query: ORDERS_QUERY },
                          { query: CLASS_VIEW_GRID_QUERY }
                        ]}
                        onCompleted={() => this.onCompleted(addFlag)}
                      >
                        {(mutation, { loading, error }) => {
                          if (error) return <div>Error</div>;

                          return (
                            <Button
                              appearance="primary"
                              onClick={() => {
                                const orders = currentRecipe.ingredients.map(
                                  recipeIngredient => ({
                                    amount: servings * recipeIngredient.amount,
                                    ingredient: {
                                      connect: {
                                        id: recipeIngredient.ingredient.id
                                      }
                                    },
                                    madeBy: {
                                      connect: { id: user.id }
                                    },
                                    class: {
                                      connect: {
                                        id: currentClass.value
                                      }
                                    }
                                  })
                                );

                                mutation({ variables: { orders } });
                              }}
                              isLoading={loading}
                            >
                              Order Recipe
                            </Button>
                          );
                        }}
                      </Mutation>
                    )}
                  </FlagContext.Consumer>
                </Fragment>
              )}
            </Fragment>
          );
        }}
      </Query>
    );
  }

  onCompleted = addFlag => {
    const { onCompleted } = this.props;

    window.mixpanel.track("Made orders");

    addFlag({
      type: "success",
      title: "Your recipe was ordered successfully",
      description: changesNotice
    });

    if (onCompleted) onCompleted();
  };
}

export default OrderRecipe;

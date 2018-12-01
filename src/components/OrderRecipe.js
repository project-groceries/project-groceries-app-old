import React, { Component, Fragment } from "react";
import { css } from "emotion";
import { Query, Mutation } from "react-apollo";
import { ORDER_RECIPE_QUERY, CREATE_ORDERS_MUTATION } from "../queries";
import Spinner from "./Spinner";
import { RadioSelect } from "@atlaskit/select";
import Button from "@atlaskit/button";
import { FlagContext } from "../flag-context";
import { changesNotice } from "../utils";

class OrderRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentClass: null,
      currentRecipe: null,
      selectedRecipe: null,
      servings: 1,
    };
  }

  render() {
    const { currentClass } = this.props;
    
    const {
      currentRecipe,
      selectedRecipe,
      servings,
    } = this.state;

    return (
      <Query query={ORDER_RECIPE_QUERY} pollInterval={5000}>
        {({ loading, error, data }) => {
          const hasData = data ? Object.keys(data).length === 2 : undefined;
          if (!hasData && loading) return <Spinner />;

          if (error) return <div>Error</div>;

          const { user, recipes } = data;

          return (
            <Fragment>
              <RadioSelect
                className="radio-select"
                classNamePrefix="react-select"
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
                      currentRecipe: recipes.find(
                        r => r.id === data.value
                      )
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
                            servings:
                              pp.servings > 1
                                ? pp.servings - 1
                                : 1
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
                    ({ id, amount, ingredient: { name } }) => (
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
                        <small>{amount * servings}</small>
                      </div>
                    )
                  )}
                  <FlagContext.Consumer>
                    {({ addFlag }) =>
                      <Mutation
                        mutation={CREATE_ORDERS_MUTATION}
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
                                    amount:
                                      servings *
                                      recipeIngredient.amount,
                                    ingredient: {
                                      connect: {
                                        id:
                                          recipeIngredient.ingredient
                                            .id
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
                    }
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

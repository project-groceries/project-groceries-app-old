import React, { Component, Fragment } from "react";
import TextToggle from "./TextToggle";
import { css } from "emotion";
import { Query, Mutation } from "react-apollo";
import { ORDER_CAROUSEL_QUERY, CREATE_ORDERS_MUTATION } from "../queries";
import Spinner from "./Spinner";
import { RadioSelect } from "@atlaskit/select";
import AsyncSelect from "react-select/lib/Async";
import Button from "@atlaskit/button";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import styled from "styled-components";
import { Close } from "styled-icons/material";
import UndrawChef from "./svg/UndrawChef";
import CreateRecipe from "./CreateRecipe";
import { FlagContext } from "../flag-context";
import { changesNotice } from "../utils";

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

class OrderCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRecipe: true,
      currentClass: null,
      currentRecipe: null,
      selectedRecipe: null,
      servings: 1,
      selectedIngredients: new Map(),
      isCreateRecipeModalOpen: false
    };
  }

  render() {
    const {
      isRecipe,
      currentClass,
      currentRecipe,
      selectedRecipe,
      servings,
      selectedIngredients,
      isCreateRecipeModalOpen
    } = this.state;

    return (
      <div
        className={css`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          // justify-content: center;
          // align-items: center;

          overflow: hidden;

          & > div:last-child {
            flex: 1;

            display: grid;
            grid-template-columns: 1fr 1fr;
            // grid-auto-rows: 100%;
            // grid-gap: 10px;
            // max-width: 1000px;
            width: 200%;
            // margin: 10px auto;

            transition: all 0.3s ease;

            overflow: auto;
          }

          & > div:last-child[data-recipe="true"] {
            transform: translateX(-50%);
          }

          & > div:last-child > div {
            padding: 10px;
            text-align: center;
            // display: flex;
            // justify-content: center;
            // align-items: center;

            & > * {
              margin-top: 10px;
            }
          }
        `}
      >
        <TextToggle
          id="orderCarouselToggle"
          checked={isRecipe}
          checkedText="Recipe"
          uncheckedText="Custom"
          onChange={() =>
            this.setState(prevProps => ({ isRecipe: !prevProps.isRecipe }))
          }
        />
        <div data-recipe={isRecipe}>
          <Query query={ORDER_CAROUSEL_QUERY} pollInterval={5000}>
            {({ loading, error, data }) => {
              const hasData = data ? Object.keys(data).length === 4 : undefined;
              if (!hasData && loading)
                return (
                  <Fragment>
                    <div>
                      <Spinner />
                    </div>
                    <div>
                      <Spinner />
                    </div>
                  </Fragment>
                );

              if (error) return <div>Error</div>;

              const { user, classes, ingredients, recipes } = data;

              return (
                <Fragment>
                  <div>
                    <RadioSelect
                      className="radio-select"
                      classNamePrefix="react-select"
                      value={currentClass}
                      options={classes.map(c => ({
                        label: c.name,
                        value: c.id
                      }))}
                      placeholder="Select a class to place the orders in"
                      onChange={data => {
                        if (data.value) {
                          this.setState({
                            currentClass: data
                          });
                        }
                      }}
                    />
                    {currentClass && (
                      <Fragment>
                        <AsyncSelect
                          value=""
                          placeholder="Select an ingredient to add to the order"
                          maxMenuHeight={200}
                          defaultOptions
                          loadOptions={(inputValue, callback) => {
                            callback(
                              this.filterIngredients(inputValue, ingredients)
                            );
                          }}
                          onChange={data => {
                            if (data.value) {
                              this.setState(prev => ({
                                selectedIngredients: prev.selectedIngredients.set(
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
                        {selectedIngredients.size > 0 && (
                          <Fragment>
                            {[...selectedIngredients].map(
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
                                      width: 50px;
                                    }
                                  `}
                                >
                                  <BlackClose
                                    onClick={() =>
                                      this.setState(prev => {
                                        prev.selectedIngredients.delete(value);
                                        return {
                                          selectedIngredients:
                                            prev.selectedIngredients
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
                                        selectedIngredients: ps.selectedIngredients.set(
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
                                          const orders = [...selectedIngredients]
                                            .map(([id, ingredient]) => ({
                                              amount: ingredient.amount,
                                              ingredient: {
                                                connect: {
                                                  id
                                                }
                                              },
                                              madeBy: {
                                                connect: {
                                                  id: user.id
                                                }
                                              },
                                              class: {
                                                connect: {
                                                  id: currentClass.value
                                                }
                                              }
                                            }))
                                            .filter(({ amount }) => amount);

                                          mutation({ variables: { orders } });
                                        }}
                                        isLoading={loading}
                                      >
                                        Submit Order
                                      </Button>
                                    );
                                  }}
                                </Mutation>
                              }
                            </FlagContext.Consumer>
                          </Fragment>
                        )}
                      </Fragment>
                    )}
                  </div>
                  <div>
                    <ModalTransition>
                      {isCreateRecipeModalOpen && (
                        <Modal
                          actions={[
                            {
                              text: "Close",
                              onClick: () =>
                                this.setState({
                                  isCreateRecipeModalOpen: false
                                })
                            }
                          ]}
                          onClose={() =>
                            this.setState({
                              isCreateRecipeModalOpen: false
                            })
                          }
                          heading="Create Recipe"
                        >
                          <CreateRecipe
                            onCompleted={() =>
                              this.setState({
                                isCreateRecipeModalOpen: false
                              })
                            }
                          />
                        </Modal>
                      )}
                    </ModalTransition>
                    {!recipes.length ? (
                      <div
                        className={css`
                          height: 100%;
                          width: 100%;
                          display: flex;
                          flex-direction: column;
                          justify-content: center;
                          align-items: center;
                        `}
                      >
                        <UndrawChef width="250px" />
                        <p>There are no recipes yet</p>
                        <Button
                          appearance="link"
                          onClick={() =>
                            this.setState({ isCreateRecipeModalOpen: true })
                          }
                        >
                          Create Recipe
                        </Button>
                      </div>
                    ) : (
                      <Fragment>
                        <RadioSelect
                          className="radio-select"
                          classNamePrefix="react-select"
                          value={currentClass}
                          options={classes.map(c => ({
                            label: c.name,
                            value: c.id
                          }))}
                          placeholder="Select a class to place the orders in"
                          onChange={data => {
                            if (data.value) {
                              this.setState({ currentClass: data });
                            }
                          }}
                        />
                        {currentClass && (
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
                        )}
                        <div>
                          <Button
                            appearance="subtle"
                            onClick={() =>
                              this.setState({
                                isCreateRecipeModalOpen: true
                              })
                            }
                          >
                            Or Create Another Recipe
                          </Button>
                        </div>
                      </Fragment>
                    )}
                  </div>
                </Fragment>
              );
            }}
          </Query>
        </div>
        {/* <CreateOrder /> */}
      </div>
    );
  }

  filterIngredients = (inputValue, ingredients) => {
    const { selectedIngredients } = this.state;

    return ingredients
      .filter(i => i.name.toLowerCase().includes(inputValue.toLowerCase()))
      .filter(i => !selectedIngredients.has(i.id))
      .map(i => ({ value: i.id, label: i.name }))
      .slice(0, inputValue.length > 2 ? undefined : 40); // reduce results for faster loading
  };

  onCompleted = addFlag => {
    const { onCompleted } = this.props;
    const { isRecipe } = this.state;

    window.mixpanel.track("Made orders");

    const action = isRecipe ? "recipe was ordered" : "custom order was made";

    addFlag({
      type: "success",
      title: `Your ${action} successfully`,
      description: changesNotice
    });

    if (onCompleted) onCompleted();
  };
}

export default OrderCarousel;

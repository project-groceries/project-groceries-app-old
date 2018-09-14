/* global mixpanel */

import React, { Component, Fragment } from "react";
import { css } from "emotion";
import { Query, Mutation } from "react-apollo";
import { withToastManager } from "react-toast-notifications";
import { CREATE_ORDER_QUERY, CREATE_ORDERS_MUTATION } from "../queries";
import Spinner from "./Spinner";
import Select from "react-select";
import Add from "./svg/Add";
import Close from "./svg/Close";

const orderItem = css`
  background-color: #f1f1f1;
  box-shadow: rgba(0, 0, 0, 0.14) 0 2px 2px 0;

  display: flex;
  // flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  margin: 20px 5px;

  & input {
    width: 40px;
    margin: 5px;
  }

  & > *:not(svg) {
    flex: 1;
    text-align: center;
  }

  & > svg {
    fill: #c9c9c9;

    margin: 5px;
    padding: 5px;
    // background-color: white;
    // width: 40px;
    height: 40px;
    width: 40px;
    transition: all 0.1s ease;
  }

  & > svg:hover {
    cursor: pointer;
    transform: scale(1.2);
  }
`;

const addOrderItem = css`
  ${orderItem};

  background-color: inherit;
  box-shadow: 0px 0px 5px 0px grey;

  &:hover {
    cursor: pointer;
    box-shadow: 0px 0px 10px 0px grey;
  }

  svg {
    height: 60px;
    fill: #d9d9d9;
    transition: all 0.1s ease;
  }

  &:hover svg {
    transform: scale(1.4);
  }
`;

class CreateOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderedIngredients: new Map(),
      addingIngredients: false,
      mutationLoading: false,
      isRecipe: false,
      recipeTitle: "Untitled Recipe"
    };
  }

  render() {
    return (
      <Query query={CREATE_ORDER_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <p>Error</p>;

          const { classId } = this.props;
          const {
            orderedIngredients,
            addingIngredients,
            mutationLoading,
            isRecipe,
            recipeTitle
          } = this.state;
          const {
            id: userId,
            school: { ingredients }
          } = data.user;
          const unorderedIngredients = ingredients.filter(
            i => !orderedIngredients.has(i.id)
          );

          const time = new Date();

          return mutationLoading ? (
            <Spinner />
          ) : (
            <div
              className={css`
                border-left: 5px solid rgb(201, 201, 201);
                padding: 10px;
                width: 350px;
                margin: 10px auto;
              `}
            >
              {isRecipe ? (
                <input
                  type="text"
                  value={recipeTitle}
                  onChange={e => {
                    e.preventDefault();

                    this.setState({ recipeTitle: e.target.value });
                  }}
                  placeholder="Untitled recipe"
                />
              ) : (
                <h2>{time.toLocaleString()}</h2>
              )}
              {[...orderedIngredients].map(([id, ingredient]) => (
                <div key={id} className={orderItem}>
                  <h3>{ingredient.name}</h3>
                  <div>
                    <input
                      id="name"
                      value={ingredient.amount}
                      // onChange={e => this.setState({ amount: e.target.value })}
                      onChange={e => {
                        const amount = e.target.value;

                        this.setState(prevState => {
                          const currentIngredient = prevState.orderedIngredients.get(
                            id
                          );
                          prevState.orderedIngredients.set(id, {
                            ...currentIngredient,
                            amount: +amount
                          });

                          return {
                            orderedIngredients: prevState.orderedIngredients
                          };
                        });
                      }}
                      type="text"
                      placeholder="Amount"
                      required={true}
                    />
                    <small> {ingredient.unit}</small>
                  </div>
                  <Close
                    onClick={() => {
                      alert("just got clicked");
                      this.setState(prevState => {
                        prevState.orderedIngredients.delete(id);
                        return {
                          orderedIngredients: prevState.orderedIngredients
                        };
                      });
                    }}
                  />
                </div>
              ))}
              {addingIngredients ? (
                <Select
                  autoFocus={true}
                  options={unorderedIngredients.map(i => ({
                    value: i.id,
                    label: i.name
                  }))}
                  onChange={({ value: id }) => {
                    // const tempOrderedIngredients =
                    const currentIngredient = unorderedIngredients.find(
                      i => i.id === id
                    );

                    if (currentIngredient) {
                      this.setState(prevState => {
                        prevState.orderedIngredients.set(id, {
                          name: currentIngredient.name,
                          amount: 1,
                          unit: currentIngredient.unit
                        });

                        return {
                          orderedIngredients: prevState.orderedIngredients,
                          addingIngredients: false
                        };
                      });
                    }
                  }}
                  aria-label="Select an ingredient to add to the order"
                  placeholder="Select an ingredient..."
                />
              ) : (
                <span
                  className={addOrderItem}
                  onClick={() => this.setState({ addingIngredients: true })}
                >
                  <Add />
                </span>
              )}
              {orderedIngredients.size ? (
                isRecipe ? (
                  <Fragment>
                    <input
                      type="button"
                      value="Save this recipe"
                      className="info"
                    />
                    <input
                      type="button"
                      value="Back to individual order"
                      className="default"
                      onClick={() => this.setState({ isRecipe: false })}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <Mutation
                      mutation={CREATE_ORDERS_MUTATION}
                      onCompleted={this._success}
                      onError={this._announceError}
                      update={this._success}
                    >
                      {mutation => {
                        return (
                          <input
                            type="button"
                            value="Add the order"
                            className="success"
                            onClick={() => {
                              const orders = [...orderedIngredients].map(
                                ([id, ingredient]) => ({
                                  amount: ingredient.amount,
                                  ingredient: { connect: { id } },
                                  madeBy: { connect: { id: userId } },
                                  class: { connect: { id: classId } }
                                })
                              );

                              console.log("orders", orders);
                              this.setState({ mutationLoading: true });

                              mutation({ variables: { orders } });
                            }}
                          />
                        );
                      }}
                    </Mutation>
                    <input
                      type="button"
                      value="Save order as a recipe"
                      className="default"
                      onClick={() => this.setState({ isRecipe: true })}
                    />
                  </Fragment>
                )
              ) : (
                ""
              )}
            </div>
          );
        }}
      </Query>
    );
  }

  _announceError = async () => {
    const { toastManager } = this.props;

    this.setState({ mutationLoading: false });
    toastManager.add("An error occurred", {
      appearance: "error",
      autoDismiss: true
    });
  };

  _success = async () => {
    const { toastManager, onCompleted } = this.props;

    mixpanel.track("Made orders");

    this.setState({ mutationLoading: false });
    toastManager.add("Your order was added successfully", {
      appearance: "success",
      autoDismiss: true
    });

    if (onCompleted) onCompleted();
  };
}

export default withToastManager(CreateOrder);

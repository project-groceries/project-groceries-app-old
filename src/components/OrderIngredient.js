import React, { Component, Fragment } from "react";
import { css } from "emotion";
import { Query, Mutation } from "react-apollo";
import { ORDER_INGREDIENT_QUERY, CREATE_ORDERS_MUTATION } from "../queries";
import Spinner from "./Spinner";
import AsyncSelect from "react-select/lib/Async";
import Button from "@atlaskit/button";
import styled from "styled-components";
import { Close } from "styled-icons/material";
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

class OrderIngredient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIngredients: new Map()
    };
  }

  render() {
    const { currentClass } = this.props;
    
    const {
      selectedIngredients
    } = this.state;

    return (
      <Query query={ORDER_INGREDIENT_QUERY} pollInterval={5000}>
        {({ loading, error, data }) => {
          const hasData = data ? Object.keys(data).length === 2 : undefined;
          if (!hasData && loading) return <Spinner />;

          if (error) return <div>Error</div>;

          const { user, ingredients } = data;

          return (
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
          );
        }}
      </Query>
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

    window.mixpanel.track("Made orders");

    addFlag({
      type: "success",
      title: "Your order was made successfully",
      description: changesNotice
    });

    if (onCompleted) onCompleted();
  };
}

export default OrderIngredient;

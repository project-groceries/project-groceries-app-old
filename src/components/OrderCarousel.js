import React, { Component, Fragment } from "react";
import TextToggle from "./TextToggle";
import { css } from "emotion";
import { Query, Mutation } from "react-apollo";
import { ORDER_CAROUSEL_QUERY, CREATE_ORDERS_MUTATION } from "../queries";
import Spinner from "./Spinner";
import { RadioSelect } from "@atlaskit/select";
import Select from "react-select";
import Button from "@atlaskit/button";
import styled from "styled-components";
import { Close } from "styled-icons/material";
import UndrawChef from "./svg/UndrawChef";

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
      selectedIngredients: new Map()
    };
  }

  render() {
    const { isRecipe, currentClass, selectedIngredients } = this.state;

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
          <Query query={ORDER_CAROUSEL_QUERY}>
            {({ loading, error, data }) => {
              if (loading)
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
                      onChange={data => this.setState({ currentClass: data })}
                    />
                    {currentClass && (
                      <Fragment>
                        <Select
                          placeholder="Select an ingredient to add to the order"
                          value=""
                          options={ingredients
                            .filter(i => !selectedIngredients.has(i.id))
                            .map(i => ({ value: i.id, label: i.name }))}
                          onChange={data =>
                            this.setState(prev => ({
                              selectedIngredients: prev.selectedIngredients.set(
                                data.value,
                                { ...data, amount: 1 }
                              )
                              // [
                              //   ...prev.selectedIngredients,
                              //   { ...data, amount: 1 }
                              // ]
                            }))
                          }
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
                                      width: 100px;
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
                            <Mutation mutation={CREATE_ORDERS_MUTATION}>
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
                          </Fragment>
                        )}
                      </Fragment>
                    )}
                  </div>
                  <div>
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
                          onChange={data =>
                            this.setState({ currentClass: data })
                          }
                        />
                        {currentClass && <h1>Ta Da</h1>}
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
}

export default OrderCarousel;
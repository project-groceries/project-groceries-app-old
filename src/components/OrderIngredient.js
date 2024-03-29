import React, { Component, Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import {
  ORDER_INGREDIENT_QUERY,
  CREATE_ORDERS_MUTATION,
  ORDERS_QUERY,
  CLASS_VIEW_GRID_QUERY
} from "../queries";
import Spinner from "./Spinner";
import AsyncSelect from "react-select/lib/Async";
import Button from "@atlaskit/button";
import styled from "styled-components";
import { Close } from "styled-icons/material";
import { FlagContext } from "../flag-context";
import {
  changesNotice,
  getScaleOptions,
  getUnitScale,
  getSpecificScale,
  volumeToMass,
  searchIngredients
} from "../utils";
import Select from "react-select";

const BlackClose = styled(Close)`
  color: black;

  width: 20px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: whitesmoke;
  padding: 10px;

  position: relative;

  & > svg {
    position: absolute;
    top: -8px;
    left: -8px;
    background-color: orange;
    border-radius: 5px;

    transition: all 0.3s ease;

    &:hover {
      cursor: pointer;
      transform: scale(1.2);
    }
  }

  & > div {
    display: flex;

    & > div {
      width: 150px;
    }

    & > input {
      height: auto;
      width: 50px;
      margin: 0 5px;
    }
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
    const { selectedIngredients } = this.state;

    return (
      <Query query={ORDER_INGREDIENT_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;

          if (error) return <div>Error</div>;

          const { user, ingredients } = data;

          return (
            <Fragment>
              <AsyncSelect
                value=""
                placeholder="Search for an ingredient to add to the order"
                maxMenuHeight={200}
                autoFocus
                defaultOptions
                loadOptions={(inputValue, callback) => {
                  callback(
                    searchIngredients(
                      inputValue,
                      ingredients,
                      selectedIngredients
                    )
                  );
                }}
                onChange={this.onSelectChange}
              />
              {selectedIngredients.size > 0 && (
                <Fragment>
                  {[...selectedIngredients].map(
                    ([, { name, id, amount, unit, measurement }]) => (
                      <OrderItem key={id}>
                        <BlackClose onClick={() => this.closeOrderItem(id)} />
                        <small>{name}</small>
                        <div>
                          <input
                            type="number"
                            min={0}
                            onChange={e => this.editAmount(e, id)}
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
                              defaultValue={getUnitScale(measurement)}
                              options={getScaleOptions(measurement)}
                              onChange={data => this.setScale(id, data.value)}
                            />
                          )}
                        </div>
                      </OrderItem>
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
                              onClick={() => this.submitOrder(mutation, user)}
                              isLoading={loading}
                            >
                              Submit Order
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

  onSelectChange = data => {
    if (data.value) {
      this.setState(prev => ({
        selectedIngredients: prev.selectedIngredients.set(data.value.id, {
          ...data.value,
          amount: 1,
          scale: data.value.measurement
            ? getSpecificScale(data.value.measurement, 1000)
            : null
        })
      }));
    }
  };

  closeOrderItem = id => {
    this.setState(prev => {
      prev.selectedIngredients.delete(id);
      return {
        selectedIngredients: prev.selectedIngredients
      };
    });
  };

  editAmount = (event, id) => {
    const { value: newAmount } = event.target;

    this.setState(prevState => {
      const mapFiller = prevState.selectedIngredients.get(id);

      return {
        selectedIngredients: prevState.selectedIngredients.set(id, {
          ...mapFiller,
          amount: Number(newAmount) || ""
        })
      };
    });
  };

  setScale = (id, multiplier) => {
    this.setState(prevState => {
      const mapFiller = prevState.selectedIngredients.get(id);

      return {
        selectedIngredients: prevState.selectedIngredients.set(id, {
          ...mapFiller,
          scale: getSpecificScale(mapFiller.measurement, multiplier)
        })
      };
    });
  };

  submitOrder = (mutation, user) => {
    const { currentClass } = this.props;
    const { selectedIngredients } = this.state;

    const orders = [...selectedIngredients]
      .filter(([, { amount }]) => amount) // skip empty ingredients
      .map(([id, { amount, density, scale, measurement }]) => ({
        amount: scale
          ? scale.isMass
            ? volumeToMass(amount, scale.amount, density).toFixed()
            : (amount * scale.amount).toFixed()
          : amount,
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
        },
        scale: measurement ? { connect: { id: scale.id } } : null
      }));

    mutation({ variables: { orders } });
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

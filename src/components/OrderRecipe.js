import React, { Component } from "react";
import Select from "react-select";
import { Query, Mutation } from "react-apollo";
import { ORDER_RECIPE_QUERY, CREATE_ORDERS_MUTATION } from "../queries";
import Spinner from "./Spinner";
import { css } from "emotion";
import { withToastManager } from "react-toast-notifications";

class OrderRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRecipe: null,
      amount: 1,
      mutationLoading: false
    };
  }

  render() {
    return (
      <Query query={ORDER_RECIPE_QUERY}>
        {({ error, loading, data }) => {
          if (error) return <p>Error</p>;
          if (loading) return <Spinner />;

          const { classId } = this.props;
          const { currentRecipe, amount, mutationLoading } = this.state;
          const { id: userId, school } = data.user;
          const { recipes } = school;

          return mutationLoading ? (
            <Spinner />
          ) : recipes.length ? (
            <div
              className={css`
                text-align: center;
              `}
            >
              {currentRecipe ? (
                <Mutation
                  mutation={CREATE_ORDERS_MUTATION}
                  onCompleted={this._success}
                  onError={this._announceError}
                  update={this._success}
                >
                  {mutation => {
                    return (
                      <form
                        onSubmit={e => {
                          e.preventDefault();

                          const orders = currentRecipe.ingredients.map(
                            recipeIngredient => ({
                              amount: amount * recipeIngredient.amount,
                              ingredient: {
                                connect: {
                                  id: recipeIngredient.ingredient.id
                                }
                              },
                              madeBy: { connect: { id: userId } },
                              class: { connect: { id: classId } }
                            })
                          );

                          this.setState({
                            mutationLoading: true
                          });

                          mutation({ variables: { orders } });
                        }}
                      >
                        <div className="form__group">
                          <label htmlFor="amount">
                            How many servings would you like to order?
                          </label>
                          <input
                            id="amount"
                            value={amount}
                            onChange={e =>
                              this.setState({ amount: e.target.value })
                            }
                            type="number"
                            placeholder="servings"
                            min={1}
                            required={true}
                          />
                        </div>
                        <div
                          className={css`
                            width: 250px;
                            margin: 10px auto;
                            padding: 5px;
                            background-color: #ececec;
                            box-shadow: 0px 0px 1px #8a8a8a;

                            & > div {
                              margin: 5px;
                              padding: 5px;

                              display: flex;
                              justify-content: space-between;
                              align-items: center;
                            }
                          `}
                        >
                          {currentRecipe.ingredients.map(recipeIngredient => (
                            <div key={recipeIngredient.id}>
                              <small>{recipeIngredient.ingredient.name}</small>
                              <small>
                                {amount * recipeIngredient.amount}{" "}
                                {recipeIngredient.ingredient.unit}
                              </small>
                            </div>
                          ))}
                        </div>
                        <input
                          className="btn info"
                          type="submit"
                          value="Confirm Order"
                        />
                        <button
                          className="default"
                          onClick={() =>
                            this.setState({ currentRecipe: null, amount: 1 })
                          }
                        >
                          Change Recipe
                        </button>
                      </form>
                    );
                  }}
                </Mutation>
              ) : (
                <Select
                  autoFocus={true}
                  options={recipes.map(({ id, name }) => ({
                    value: id,
                    label: name
                  }))}
                  onChange={({ value: id }) => {
                    this.setState({
                      currentRecipe: recipes.find(r => r.id === id)
                    });
                  }}
                  aria-label="Select a recipe to order"
                  placeholder="Select a recipe to order..."
                  className={css`
                    width: 250px;
                    margin: 10px auto;
                  `}
                />
              )}
            </div>
          ) : (
            <p>There are no recipes yet</p>
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

    window.mixpanel.track("Ordered a recipe");
    window.mixpanel.track("Made orders");

    this.setState({ mutationLoading: false });
    toastManager.add("Recipe ordered successfully", {
      appearance: "success",
      autoDismiss: true
    });

    if (onCompleted) onCompleted();
  };
}

export default withToastManager(OrderRecipe);

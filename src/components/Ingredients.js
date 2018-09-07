import React, { Component } from "react";
import { Query } from "react-apollo";
import { INGREDIENTS_PAGE_QUERY } from "../queries";
import Spinner from "./Spinner";
import { Dialog } from "@reach/dialog";
import { css } from "emotion";
import CreateIngredients from "./CreateIngredients";
import { fullPage, overviewSection } from "../styles";
import IngredientsGrid from "./IngredientsGrid";
import IngredientView from "./IngredientView";
import { Route, Switch } from "react-router-dom";

class Ingredients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  render() {
    const { isOpen } = this.state;

    return (
      <Query query={INGREDIENTS_PAGE_QUERY}>
        {({ error, loading, data }) => {
          if (loading) return <Spinner />;
          if (error) return <p>Error</p>;

          const { ingredients } = data.user.school;

          return ingredients.length ? (
            <div
              className={css`
                display: grid;
                grid-template-columns: 250px 1fr;
                grid-template-rows: 100vh;
                & > div:first-child {
                  // flex: 1;
                  background-color: rgba(0, 0, 0, 0.1);
                  overflow: auto;
                }

                & > div:last-child {
                  // width: calc(100% - 200px);
                  background-color: rgba(0, 0, 0, 0.2);
                  overflow: auto;
                }
              `}
            >
              <div className={overviewSection}>
                <h1>Ingredients</h1>
                <IngredientsGrid />
              </div>
              <Switch>
                <Route path="/ingredients/:id" component={IngredientView} />
                <Route
                  render={() => (
                    <div className={fullPage}>
                      <p>No Ingredient Selected</p>
                    </div>
                  )}
                />
              </Switch>
            </div>
          ) : (
            <div className={fullPage}>
              <h2>There are no ingredients... yet.</h2>
              <p>You can create a few right now</p>
              <input
                className="btn default"
                type="button"
                value="Create some ingredients"
                onClick={this._toggleModal}
              />
              <Dialog isOpen={isOpen}>
                <button
                  className="close-button"
                  onClick={() => this.setState({ isOpen: false })}
                >
                  <span aria-hidden>×</span>
                </button>
                <CreateIngredients
                  onCompleted={() =>
                    this.setState({
                      isOpen: false
                    })
                  }
                />
              </Dialog>
            </div>
          );
        }}
      </Query>
    );
  }

  _toggleModal = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };
}

export default Ingredients;

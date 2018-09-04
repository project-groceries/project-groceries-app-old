import React, { Component } from "react";
import { Query } from "react-apollo";
import { INGREDIENTS_PAGE_QUERY } from "../queries";
import Spinner from "./Spinner";
import { Dialog } from "@reach/dialog";
import CreateIngredients from "./CreateIngredients";
import { fullPage } from "../styles";

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
            <div>
              <h1>Ingredients Page</h1>
              <p>Boo yah</p>
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
                  onCompleted={() => this.setState({ isOpen: false })}
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

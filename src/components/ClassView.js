import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { CLASS_VIEW_QUERY } from "../queries";
import Spinner from "./Spinner";
import { fullPage, bar } from "../styles";
import CreateIngredients from "./CreateIngredients";
import { Dialog } from "@reach/dialog";

class ClassView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  render() {
    const { match } = this.props;
    const { id } = match.params;

    return (
      <div>
        <Query query={CLASS_VIEW_QUERY} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;

            if (error) return <p>Error</p>;

            const { isOpen } = this.state;
            const {
              type,
              enrolledIn,
              classes,
              school: { ingredients }
            } = data.user;
            const appropriateClasses =
              type === "STUDENT" ? enrolledIn : classes;
            const appropriateClass = appropriateClasses.length
              ? appropriateClasses[0]
              : null;

            return ingredients.length ? (
              appropriateClass ? (
                <Fragment>
                  <div className={bar}>
                    <h2>{appropriateClass.name}</h2>
                  </div>
                  <div className={bar}>
                    <p>Create an order</p>
                    <p>Search</p>
                    <p>All/Summary</p>
                  </div>
                  <p>Class id is: {id}</p>
                </Fragment>
              ) : (
                <div className={fullPage}>
                  <h2>Class Not Found!</h2>
                </div>
              )
            ) : (
              <div className={fullPage}>
                <h2>There are no ingredients to order... yet.</h2>
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
      </div>
    );
  }

  _toggleModal = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };
}

export default ClassView;

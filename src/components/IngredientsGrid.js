import React, { Component } from "react";
import { Query } from "react-apollo";
import { INGREDIENTS_GRID_QUERY } from "../queries";
import Spinner from "./Spinner";
import { css } from "emotion";
import { Link } from "react-router-dom";
import { Dialog } from "@reach/dialog";
import Add from "./svg/Add";
import CreateIngredients from "./CreateIngredients";

const ingredientsGrid = css`
  padding: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  // display: grid;
  // grid-auto-columns: 200px;
  // grid-auto-rows: 120px;
  // grid-gap: 20px;

  & > * {
    margin: 10px;
  }

  & > a {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    padding: 10px;
    width: 200px;
    height: 100px;

    box-shadow: rgba(0, 0, 0, 0.14) 0 2px 2px 0;
    background-color: #f1f1f1;
    transition: all 0.1s ease;

    text-align: center;
  }

  & > a:hover {
    transform: scale(1.05);
  }

  & > a > div {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }

  & span {
    width: 200px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 5px 0px grey;
    transition: all 0.1s ease;

    position: sticky;
    bottom: 10px;
    /* right: 0px; */
    background-color: white;
  }

  & span:hover {
    cursor: pointer;
    box-shadow: 0px 0px 10px 0px grey;
  }

  & svg {
    height: 60px;
    fill: #d9d9d9;
    transition: all 0.1s ease;
  }

  & span:hover svg {
    transform: scale(1.4);
  }
`;

class IngredientsGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  render() {
    const { isOpen } = this.state;

    return (
      <Query query={INGREDIENTS_GRID_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <p>Error</p>;

          const { ingredients } = data.user.school;

          return (
            <div className={ingredientsGrid}>
              {ingredients.map(i => (
                <Link to={`/ingredients/${i.id}`} key={i.id}>
                  <h3>{i.name}</h3>
                  <small>Measured in {i.unit}</small>
                  <div>
                    <small>{i.orders.length} orders</small>
                    <small>{i.tags.length} tags</small>
                  </div>
                </Link>
              ))}
              <span onClick={this._toggleModal}>
                <Add />
              </span>
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

export default IngredientsGrid;

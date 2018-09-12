import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { CLASS_VIEW_QUERY } from "../queries";
import Spinner from "./Spinner";
import { fullPage, bar } from "../styles";
import CreateIngredients from "./CreateIngredients";
import { Dialog } from "@reach/dialog";
import { css } from "emotion";
import CreateOrder from "./CreateOrder";
import Menu from "./svg/Menu";
import Unenrol from "./Unenrol";

const classViewGrid = css`
  display: grid;
  grid-template-columns: 300px 300px;
  grid-auto-rows: 60px;
  grid-gap: 20px;
  max-width: 1000px;
  width: fit-content;
  margin: 10px auto;

  & > div {
    background-color: #f1f1f1;
    box-shadow: rgba(0, 0, 0, 0.14) 0 2px 2px 0;

    display: flex;
    // flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  & > div:hover {
    cursor: pointer;
  }

  & > div[data-active="true"] {
    grid-row-end: span 3;
  }
`;

const burger = css`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: rgb(220, 220, 220);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  position: fixed;
  top: 10px;
  right: 10px;

  &:hover {
    cursor: pointer;
    background-color: rgb(180, 180, 180);
  }
`;

const burgerOpen = css`
  transform: translateX(-250px);
`;

const menu = css`
  width: 250px;
  background-color: gainsboro;
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  transition: all 0.3s ease;
  transform: translateX(250px);
`;

const menuOpen = css`
  transform: none;
`;

class ClassView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreateIngredientsModalOpen: false,
      isAddOrderModalOpen: false,
      isUnenrolModalOpen: false,
      activeIngredient: null,
      menuIsOpen: false
    };
  }

  render() {
    const { match } = this.props;
    const { id } = match.params;

    return (
      <div>
        <Query query={CLASS_VIEW_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;

            if (error) return <p>Error</p>;

            const {
              isCreateIngredientsModalOpen,
              isAddOrderModalOpen,
              isUnenrolModalOpen,
              activeIngredient,
              menuIsOpen
            } = this.state;
            const {
              type,
              enrolledIn,
              classes,
              school: { ingredients }
            } = data.user;
            const appropriateClasses =
              type === "STUDENT" ? enrolledIn : classes;
            const appropriateClass = appropriateClasses.length
              ? appropriateClasses.find(c => c.id === id)
              : null;

            return ingredients.length ? (
              appropriateClass ? (
                <Fragment>
                  <div className={bar}>
                    <h2>{appropriateClass.name}</h2>
                  </div>
                  <div className={bar}>
                    <input
                      type="button"
                      value="Add an order"
                      className="success"
                      onClick={this._toggleAddOrderModal}
                    />
                    <Dialog isOpen={isAddOrderModalOpen}>
                      <button
                        className="close-button"
                        onClick={() =>
                          this.setState({ isAddOrderModalOpen: false })
                        }
                      >
                        <span aria-hidden>×</span>
                      </button>
                      <CreateOrder
                        classId={id}
                        onCompleted={() =>
                          this.setState({ isAddOrderModalOpen: false })
                        }
                      />
                    </Dialog>
                    <small>Search (Coming Soon)</small>
                    <p>All/Summary</p>
                    <div
                      className={css`
                        ${burger};
                        ${menuIsOpen ? burgerOpen : ""};
                      `}
                      onClick={() =>
                        this.setState(prevState => ({
                          menuIsOpen: !prevState.menuIsOpen
                        }))
                      }
                    >
                      <Menu />
                    </div>
                  </div>
                  <div className={classViewGrid}>
                    {ingredients.map(ingredient => {
                      const totalOrders = ingredient.orders
                        .filter(o => o.class.id === id)
                        .reduce((acc, cur) => acc + cur.amount, 0);

                      return (
                        <div
                          key={ingredient.id}
                          data-active={
                            activeIngredient === ingredient.id ? true : false
                          }
                          onClick={e => {
                            e.preventDefault();

                            if (activeIngredient === ingredient.id) {
                              this.setState({
                                activeIngredient: null
                              });
                            } else {
                              this.setState({
                                activeIngredient: ingredient.id
                              });
                            }
                          }}
                        >
                          <h3>{ingredient.name}</h3>
                          <small>
                            {totalOrders} {ingredient.unit}
                          </small>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className={css`
                      ${menu};
                      ${menuIsOpen ? menuOpen : ""};
                    `}
                  >
                    <h2>Hello</h2>
                    <input
                      type="button"
                      value={`${
                        type === "TEACHER" ? "Delete" : "Unenroll from"
                      } this class`}
                      className={type === "TEACHER" ? "error" : "warning"}
                      onClick={this._toggleUnenrolModal}
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px"
                      }}
                    />
                    <Dialog isOpen={isUnenrolModalOpen}>
                      <button
                        className="close-button"
                        onClick={() =>
                          this.setState({ isUnenrolModalOpen: false })
                        }
                      >
                        <span aria-hidden>×</span>
                      </button>
                      <Unenrol
                        id={id}
                        onCompleted={() =>
                          this.setState({ isUnenrolModalOpen: false })
                        }
                      />
                    </Dialog>
                  </div>
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
                  onClick={this._toggleCreateIngredientsModal}
                />
                <Dialog isOpen={isCreateIngredientsModalOpen}>
                  <button
                    className="close-button"
                    onClick={() =>
                      this.setState({ isCreateIngredientsModalOpen: false })
                    }
                  >
                    <span aria-hidden>×</span>
                  </button>
                  <CreateIngredients
                    onCompleted={() =>
                      this.setState({ isCreateIngredientsModalOpen: false })
                    }
                  />
                </Dialog>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }

  _toggleCreateIngredientsModal = () => {
    this.setState(prevState => ({
      isCreateIngredientsModalOpen: !prevState.isCreateIngredientsModalOpen
    }));
  };

  _toggleAddOrderModal = () => {
    this.setState(prevState => ({
      isAddOrderModalOpen: !prevState.isAddOrderModalOpen
    }));
  };

  _toggleUnenrolModal = () => {
    this.setState(prevState => ({
      isUnenrolModalOpen: !prevState.isUnenrolModalOpen
    }));
  };
}

export default ClassView;

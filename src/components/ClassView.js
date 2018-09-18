import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { CLASS_VIEW_QUERY } from "../queries";
import Spinner from "./Spinner";
import { fullPage, bar, circleIcon } from "../styles";
import CreateIngredients from "./CreateIngredients";
import { Dialog } from "@reach/dialog";
import { css } from "emotion";
import CreateOrder from "./CreateOrder";
import Menu from "./svg/Menu";
import Unenrol from "./Unenrol";
import DeleteClass from "./DeleteClass";
import Close from "./svg/Close";

const classViewGrid = css`
  display: grid;
  grid-template-columns: 300px 300px;
  grid-auto-rows: 80px;
  grid-gap: 20px;
  max-width: 1000px;
  width: fit-content;
  margin: 10px auto;

  @media (max-width: 768px) {
    grid-template-columns: 300px;
  }

  @media (min-width: 1400px) {
    grid-template-columns: 300px 300px 300px;
  }

  & > div {
    background-color: #f1f1f1;
    box-shadow: rgba(0, 0, 0, 0.14) 0 2px 2px 0;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 50px 30px 1fr;

    & > div:first-child {
      display: flex;
      // flex-direction: column;
      justify-content: space-around;
      align-items: center;

      h3 {
        max-width: 70%;
        overflow: hidden;
        text-align: center;
      }
    }

    & > div:nth-child(2) {
      display: flex;
      // justify-content:
      align-items: center;

      & > small {
        padding: 2px 5px;
        margin: 5px;
        background-color: white;
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
      }
    }
  }

  & > div:hover {
    cursor: pointer;
  }

  & > div[data-active="true"] {
    grid-row-end: span 3;
  }
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

const toggle = css`
  display: flex;
  flex-direction: column;
  align-items: center;

  h4 {
    text-align: center;
  }

  .tgl {
    display: none;

    // add default box-sizing for this scope
    &,
    &:after,
    &:before,
    & *,
    & *:after,
    & *:before,
    & + .tgl-btn {
      box-sizing: border-box;
      &::selection {
        background: none;
      }
    }

    + .tgl-btn {
      outline: 0;
      display: block;
      width: 4em;
      height: 2em;
      position: relative;
      cursor: pointer;
      user-select: none;
      &:after,
      &:before {
        position: relative;
        display: block;
        content: "";
        width: 50%;
        height: 100%;
      }

      &:after {
        left: 0;
      }

      &:before {
        display: none;
      }
    }

    &:checked + .tgl-btn:after {
      left: 50%;
    }
  }

  .tgl-light {
    + .tgl-btn {
      background: #f0f0f0;
      border-radius: 2em;
      padding: 2px;
      transition: all 0.4s ease;
      &:after {
        border-radius: 50%;
        background: #fff;
        transition: all 0.2s ease;
      }
    }

    &:checked + .tgl-btn {
      background: #9fd6ae;
    }
  }
`;

class ClassView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreateIngredientsModalOpen: false,
      isAddOrderModalOpen: false,
      isUnenrolModalOpen: false,
      activeIngredient: null,
      menuIsOpen: false,
      isSummary: false,
      searchValue: ""
    };
  }

  render() {
    const { match, history } = this.props;
    const { id } = match.params;

    return (
      <div
        className={css`
          position: relative;
        `}
      >
        <Query query={CLASS_VIEW_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;

            if (error) return <p>Error</p>;

            const {
              isCreateIngredientsModalOpen,
              isAddOrderModalOpen,
              isUnenrolModalOpen,
              activeIngredient,
              menuIsOpen,
              isSummary,
              searchValue
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
                  <div
                    className={css`
                      ${bar};
                      background-color: white;
                      position: sticky;
                      top: 0;
                    `}
                  >
                    <h2>{appropriateClass.name}</h2>
                  </div>
                  <div
                    className={css`
                      ${bar};
                      height: 60px;
                      background-color: white;
                      position: sticky;
                      top: 40px;

                      @media (max-width: 768px) {
                        #search {
                          width: 150px;
                        }
                      }
                    `}
                  >
                    <div
                      className={css`
                        ${circleIcon};
                        top: -30px;
                        left: 10px;

                        display: none;

                        @media (max-width: 1000px) {
                          display: inherit;
                        }
                      `}
                      onClick={() => history.push("/classes")}
                    >
                      <Close />
                    </div>
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
                    <input
                      id="search"
                      type="text"
                      placeholder="Search..."
                      value={searchValue}
                      onChange={event => {
                        const target = event.target;
                        const value = target.value;

                        this.setState({ searchValue: value });
                      }}
                      style={{
                        padding: "6px 15px",
                        height: "40px",
                        borderRadius: "20px",
                        boxShadow: "0px 0px 2px",
                        border: "none"
                      }}
                    />
                    <div className={toggle}>
                      <h4>
                        <span
                          style={{
                            color: isSummary ? "rgba(0,0,0,0.2)" : "black"
                          }}
                        >
                          All
                        </span>{" "}
                        /{" "}
                        <span
                          style={{
                            color: isSummary ? "black" : "rgba(0,0,0,0.2)"
                          }}
                        >
                          Summary
                        </span>
                      </h4>
                      <input
                        className="tgl tgl-light"
                        id="cb1"
                        type="checkbox"
                        checked={isSummary}
                        onChange={event => {
                          const target = event.target;
                          const value = target.checked;

                          this.setState({ isSummary: value });
                        }}
                      />
                      <label className="tgl-btn" htmlFor="cb1" />
                    </div>
                    <div
                      className={css`
                        ${circleIcon};
                        position: fixed;
                        right: 10px;
                        ${menuIsOpen ? "transform: translateX(-250px);" : ""};
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
                    {this._filterIngredients(ingredients).map(ingredient => {
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
                          <div>
                            <h3>{ingredient.name}</h3>
                            <small>
                              {ingredient.totalOrders} {ingredient.unit}
                            </small>
                          </div>
                          <div>
                            {ingredient.tags.map(tag => (
                              <small key={tag.id}>{tag.name}</small>
                            ))}
                          </div>
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
                      {type === "TEACHER" ? (
                        <DeleteClass
                          id={id}
                          onCompleted={() =>
                            this.setState({ isUnenrolModalOpen: false })
                          }
                        />
                      ) : (
                        <Unenrol
                          id={id}
                          onCompleted={() =>
                            this.setState({ isUnenrolModalOpen: false })
                          }
                        />
                      )}
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

  _filterIngredients = ingredients => {
    const { match } = this.props;
    const { id } = match.params;

    const { isSummary, searchValue } = this.state;

    return ingredients
      .map(ingredient => ({
        ...ingredient,
        totalOrders: ingredient.orders
          .filter(o => o.class.id === id) // filter by class (only this class)
          .reduce((acc, cur) => acc + cur.amount, 0) // reduce to total
      }))
      .filter(
        ingredient =>
          ingredient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          ingredient.unit.toLowerCase().includes(searchValue.toLowerCase()) ||
          ingredient.tags.some(tag =>
            tag.name.toLowerCase().includes(searchValue.toLowerCase())
          )
      )
      .filter(ingredient => (isSummary ? ingredient.totalOrders : true));
  };

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

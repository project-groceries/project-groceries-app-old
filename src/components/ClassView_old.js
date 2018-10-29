import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { CLASS_VIEW_QUERY } from "../queries";
import Spinner from "./Spinner";
import { fullPage, bar, circleIcon, noPrint, fullCheck } from "../styles";
import CreateIngredients from "./CreateIngredients";
import { Dialog } from "@reach/dialog";
import { css } from "emotion";
import CreateOrder from "./CreateOrder";
import Menu from "./svg/Menu";
import Unenrol from "./Unenrol";
import DeleteClass from "./DeleteClass";
import Close from "./svg/Close";
import OrderRecipe from "./OrderRecipe";
import Visibility from "./svg/Visibility";
import VisibilityOff from "./svg/VisibilityOff";

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

  @media print {
    grid-template-columns: 300px 300px;
  }

  & > div {
    background-color: #f1f1f1;
    box-shadow: rgba(0, 0, 0, 0.14) 0 2px 2px 0;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 50px 30px 1fr;

    overflow: hidden;

    & > div:first-child {
      display: flex;
      // flex-direction: column;
      justify-content: space-around;
      align-items: center;

      position: sticky;
      top: 0;
      background-color: #f1f1f1;

      h3 {
        max-width: 70%;
        overflow: hidden;
        text-align: center;
      }
    }

    & > div:first-child:hover {
      cursor: pointer;
    }

    & > div:nth-child(2) {
      display: flex;
      // justify-content:
      align-items: center;

      position: sticky;
      top: 50px;
      background-color: #f1f1f1;

      & > small {
        padding: 2px 5px;
        margin: 5px;
        background-color: white;
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
      }
    }
  }

  & > div.active {
    overflow: auto;
  }

  & > div[data-active="true"] {
    grid-row-end: span 3;
  }
`;

const menu = css`
  width: 250px;
  background-color: whitesmoke;
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  transition: all 0.3s ease;
  transform: translateX(250px);
  overflow: auto;
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
      isOrderRecipeModalOpen: false,
      isUnenrolModalOpen: false,
      activeIngredients: new Map(),
      menuIsOpen: false,
      isSummary: false,
      searchValue: "",
      hiddentTags: new Map(),
      hiddenUsers: new Map()
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
              isOrderRecipeModalOpen,
              isUnenrolModalOpen,
              activeIngredients,
              menuIsOpen,
              isSummary,
              searchValue
            } = this.state;
            const { user, ingredients } = data;
            const {
              type,
              enrolledIn,
              classes,
              school: { recipes, tags }
            } = user;

            const appropriateClasses =
              type === "STUDENT" ? enrolledIn : classes;
            const appropriateClass = appropriateClasses.length
              ? appropriateClasses.find(c => c.id === id)
              : null;
            let classUsers;
            if (appropriateClass)
              classUsers = [
                appropriateClass.teacher,
                ...appropriateClass.students
              ];

            return ingredients.length ? (
              appropriateClass ? (
                <Fragment>
                  <div
                    className={css`
                      ${bar};
                      background-color: white;
                      position: sticky;
                      top: 0;

                      z-index: 2;
                    `}
                  >
                    <h2>{appropriateClass.name}</h2>
                  </div>
                  <div
                    className={css`
                      ${noPrint};
                      ${bar};
                      height: 60px;
                      background-color: white;
                      position: sticky;
                      top: 40px;

                      z-index: 2;

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
                    {recipes.length ? (
                      <div
                        className={css`
                          display: flex;
                          flex-direction: column;
                          justify-content: center;
                          align-items: center;
                        `}
                      >
                        <h4>Order</h4>
                        <div>
                          <input
                            type="button"
                            value="Ingredients"
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
                            type="button"
                            value="A Recipe"
                            className="default"
                            onClick={this._toggleOrderRecipeModal}
                          />
                          <Dialog isOpen={isOrderRecipeModalOpen}>
                            <button
                              className="close-button"
                              onClick={() =>
                                this.setState({
                                  isOrderRecipeModalOpen: false
                                })
                              }
                            >
                              <span aria-hidden>×</span>
                            </button>
                            <OrderRecipe
                              classId={id}
                              onCompleted={() =>
                                this.setState({
                                  isOrderRecipeModalOpen: false
                                })
                              }
                            />
                          </Dialog>
                        </div>
                      </div>
                    ) : (
                      <Fragment>
                        <input
                          type="button"
                          value="Order Ingredients"
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
                      </Fragment>
                    )}
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
                          data-active={activeIngredients.get(ingredient.id)}
                          className={
                            activeIngredients.get(ingredient.id) ? "active" : ""
                          }
                        >
                          <div
                            onClick={e => {
                              e.preventDefault();

                              if (activeIngredients.get(ingredient.id)) {
                                this.setState(prevState => {
                                  prevState.activeIngredients.set(
                                    ingredient.id,
                                    false
                                  );
                                  return {
                                    activeIngredient:
                                      prevState.activeIngredients
                                  };
                                });
                              } else {
                                this.setState(prevState => {
                                  prevState.activeIngredients.set(
                                    ingredient.id,
                                    true
                                  );
                                  return {
                                    activeIngredient:
                                      prevState.activeIngredients
                                  };
                                });
                              }
                            }}
                          >
                            {ingredient.name.length > 40 ? (
                              <h3 title={ingredient.name}>
                                {ingredient.name.substring(0, 40)}
                                ...
                              </h3>
                            ) : (
                              <h3>{ingredient.name}</h3>
                            )}
                            <small>
                              {ingredient.totalOrders} {ingredient.unit}
                            </small>
                          </div>
                          <div>
                            {ingredient.tags.map(tag => (
                              <small key={tag.id}>{tag.name}</small>
                            ))}
                          </div>
                          <div
                            className={css`
                              display: flex;
                              flex-direction: column;

                              & > div {
                                display: flex;
                                justify-content: space-around;
                                align-items: center;
                                background-color: white;
                                margin: 5px;
                                padding: 5px;
                                box-shadow: 0px 0px 2px 0px #b9b9b9;
                              }
                            `}
                          >
                            {ingredient.orders
                              // .filter(order => order.class.id === id)
                              .map(order => (
                                <div key={order.id}>
                                  <p>{order.madeBy.name}</p>
                                  <p>
                                    {order.amount} {ingredient.unit}
                                  </p>
                                </div>
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
                      z-index: 2;
                    `}
                  >
                    <div
                      className={css`
                        margin: 10px;
                      `}
                    >
                      {tags.length ? (
                        <Fragment>
                          <h3>Filter ingredients by tag</h3>
                          <small>
                            ⓘ Only show ingredients that have the selected tags
                          </small>
                          <div className={fullCheck}>
                            <input
                              id="filter-tag-undefined"
                              name="filter-tag-undefined"
                              type="checkbox"
                              defaultChecked={true}
                              // checked={this.state.isGoing}
                              onChange={e => {
                                const value = e.target.checked;

                                this.setState(prevState => {
                                  prevState.hiddentTags.set(undefined, !value);

                                  return { hiddentTags: prevState.hiddentTags };
                                });
                              }}
                            />
                            <label htmlFor="filter-tag-undefined">
                              <Visibility />
                              <VisibilityOff />
                              <span>No Tags</span>
                            </label>
                          </div>
                          {tags.map(tag => (
                            <div key={tag.id} className={fullCheck}>
                              <input
                                id={`filter-tag-${tag.id}`}
                                name={`filter-tag-${tag.id}`}
                                type="checkbox"
                                defaultChecked={true}
                                // checked={this.state.isGoing}
                                onChange={e => {
                                  const value = e.target.checked;

                                  this.setState(prevState => {
                                    prevState.hiddentTags.set(tag.id, !value);

                                    return {
                                      hiddentTags: prevState.hiddentTags
                                    };
                                  });
                                }}
                              />
                              <label htmlFor={`filter-tag-${tag.id}`}>
                                <Visibility />
                                <VisibilityOff />
                                <span>{tag.name}</span>
                              </label>
                            </div>
                          ))}
                        </Fragment>
                      ) : (
                        ""
                      )}
                      {appropriateClass.students.length ? (
                        <Fragment>
                          <h3>Filter orders by students</h3>
                          <small>ⓘ Only show orders by selected students</small>
                          {classUsers.map(user => (
                            <div key={user.id} className={fullCheck}>
                              <input
                                id={`filter-user-${user.id}`}
                                name={`filter-user-${user.id}`}
                                type="checkbox"
                                defaultChecked={true}
                                // checked={this.state.isGoing}
                                onChange={e => {
                                  const value = e.target.checked;

                                  this.setState(prevState => {
                                    prevState.hiddenUsers.set(user.id, !value);

                                    return {
                                      hiddenUsers: prevState.hiddenUsers
                                    };
                                  });
                                }}
                              />
                              <label htmlFor={`filter-user-${user.id}`}>
                                <Visibility />
                                <VisibilityOff />
                                <span>{user.name}</span>
                              </label>
                            </div>
                          ))}
                        </Fragment>
                      ) : (
                        ""
                      )}
                    </div>
                    <button
                      className="default"
                      style={{
                        position: "absolute",
                        bottom: "30px",
                        left: "-150px"
                      }}
                      onClick={() => window.print()}
                    >
                      Print
                    </button>
                    <input
                      type="button"
                      value={`${
                        type === "TEACHER" ? "Delete" : "Unenroll from"
                      } this class`}
                      className={type === "TEACHER" ? "error" : "warning"}
                      onClick={this._toggleUnenrolModal}
                      style={{
                        position: "fixed",
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

    const { isSummary, searchValue, hiddentTags, hiddenUsers } = this.state;

    return ingredients
      .filter(
        ingredient =>
          ingredient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          ingredient.unit.toLowerCase().includes(searchValue.toLowerCase()) ||
          ingredient.tags.some(tag =>
            tag.name.toLowerCase().includes(searchValue.toLowerCase())
          )
      )
      .filter(
        ingredient =>
          ingredient.tags.length
            ? ingredient.tags.some(tag => !hiddentTags.get(tag.id))
            : !hiddentTags.get(undefined)
      )
      .map(ingredient => ({
        ...ingredient,
        orders: ingredient.orders
          .filter(o => o.class.id === id) // filter by class (only this class)
          .filter(o => !hiddenUsers.get(o.madeBy.id)) // filter by user
      }))
      .map(ingredient => ({
        ...ingredient,
        totalOrders: ingredient.orders.reduce((acc, cur) => acc + cur.amount, 0)
      })) // reduce to total
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

  _toggleOrderRecipeModal = () => {
    this.setState(prevState => ({
      isOrderRecipeModalOpen: !prevState.isOrderRecipeModalOpen
    }));
  };

  _toggleUnenrolModal = () => {
    this.setState(prevState => ({
      isUnenrolModalOpen: !prevState.isUnenrolModalOpen
    }));
  };
}

export default ClassView;

import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { css } from "emotion";
import Pagination from "@atlaskit/pagination";
import { CLASS_VIEW_GRID_QUERY } from "../queries";
// import OGSpinner from "./Spinner";
import { bar } from "../styles";
import Spinner from "@atlaskit/spinner";
import UndrawNoData from "./svg/UndrawNoData";

const classViewGrid = css`
  display: grid;
  grid-template-columns: 300px 300px;
  grid-auto-rows: 80px;
  grid-gap: 20px;
  max-width: 1000px;
  width: fit-content;
  margin: 10px auto;

  min-height: calc(100vh - 120px);

  // position: relative;

  @media (max-width: 1000px) {
    grid-template-columns: 300px;
  }

  @media (min-width: 1300px) {
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

      h4 {
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

class ClassViewGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      ingredientsPerPage: 30
    };
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.filter !== prevProps.filter) {
      this.setState({ page: 1 });
    }
  }

  render() {
    const { filter, filteredUsers, ids, orderBy, isSummary } = this.props;
    const { page, ingredientsPerPage } = this.state;

    return (
      <Query
        query={CLASS_VIEW_GRID_QUERY}
        variables={{
          ids,
          first: ids.length === 1 ? ingredientsPerPage : null,
          skip: ids.length == 1 ? (page - 1) * ingredientsPerPage : null,
          filter,
          filteredUsers,
          orderBy,
          summary: isSummary
        }}
        pollInterval={5000}
      >
        {({ loading, error, data }) => {
          const hasData = data ? Object.keys(data).length === 2 : undefined;
          if (!hasData && loading)
            return (
              <div
                className={css`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100%;
                `}
              >
                <Spinner size="xlarge" />
              </div>
            );

          if (error) return <div>Error</div>;

          const {
            ingredients,
            ingredientsConnection: {
              aggregate: { count: ingredientCount }
            }
          } = data;

          const pageCount = Math.ceil(ingredientCount / ingredientsPerPage);

          return ingredients.length ? (
            <Fragment>
              <div className={classViewGrid}>
                {loading && (
                  <span
                    className={css`
                      position: fixed;
                      top: 60px;
                      left: 70px;
                    `}
                  >
                    <Spinner size="large" />
                  </span>
                )}
                {ingredients.map(ingredient => {
                  return (
                    <div
                      key={ingredient.id}
                      // data-active={activeIngredients.get(ingredient.id)}
                      // className={activeIngredients.get(ingredient.id) ? "active" : ""}
                    >
                      <div
                        onClick={e => {
                          e.preventDefault();

                          // if (activeIngredients.get(ingredient.id)) {
                          //   this.setState(prevState => {
                          //     prevState.activeIngredients.set(ingredient.id, false);
                          //     return {
                          //       activeIngredient: prevState.activeIngredients
                          //     };
                          //   });
                          // } else {
                          //   this.setState(prevState => {
                          //     prevState.activeIngredients.set(ingredient.id, true);
                          //     return {
                          //       activeIngredient: prevState.activeIngredients
                          //     };
                          //   });
                          // }
                        }}
                      >
                        {ingredient.name.length > 40 ? (
                          <h4 title={ingredient.name}>
                            {ingredient.name.substring(0, 40)}
                            ...
                          </h4>
                        ) : (
                          <h4>{ingredient.name}</h4>
                        )}
                        <small>
                          {ingredient.orders.reduce(
                            (acc, cur) => acc + cur.amount,
                            0
                          )}{" "}
                          {ingredient.unit}
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
              {ids.length === 1 && (
                <div
                  className={css`
                    ${bar};
                    height: 60px;
                  `}
                >
                  <Pagination
                    value={page}
                    total={pageCount}
                    onChange={page => this.setState({ page })}
                  />
                </div>
              )}
            </Fragment>
          ) : (
            <div
              className={css`
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              `}
            >
              <UndrawNoData height="200px" />
              <h3>No Ingredients match the criteria</h3>
              {isSummary && (
                <small>
                  Note: this could mean that no ingredients have been ordered
                  yet
                </small>
              )}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default ClassViewGrid;

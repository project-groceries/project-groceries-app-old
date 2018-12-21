import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import Pagination from "@atlaskit/pagination";
import { CLASS_VIEW_GRID_QUERY } from "../queries";
import Spinner from "@atlaskit/spinner";
import UndrawNoData from "./svg/UndrawNoData";
import styled from "styled-components";
import { sumBy, massToVolume } from "../utils";

const ClassViewGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: 80px;
  grid-gap: 20px;
  margin: 10px 30px;

  min-height: calc(100vh - 120px);

  & > div {
    background-color: #f1f1f1;
    box-shadow: rgba(0, 0, 0, 0.14) 0 2px 2px 0;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 50px 30px 1fr;

    overflow: hidden;

    & > div:first-child {
      display: flex;
      justify-content: space-around;
      align-items: center;

      h4 {
        max-width: 70%;
        overflow: hidden;
        text-align: center;
      }

      @media print {
        page-break-inside: avoid;
      }
    }

    & > div:nth-child(2) {
      display: flex;
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
`;

const MainSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ClassViewGridSpinner = styled.span`
  position: fixed;
  top: 60px;
  left: 70px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
`;

const NoIngredientsContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
    const {
      filter,
      filteredUsers,
      ids,
      orderBy,
      isSummary,
      scales
    } = this.props;
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
              <MainSpinner>
                <Spinner size="xlarge" />
              </MainSpinner>
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
              <ClassViewGridContainer>
                {loading && (
                  <ClassViewGridSpinner>
                    <Spinner size="large" />
                  </ClassViewGridSpinner>
                )}
                {ingredients.map(
                  ({ id, name, unit, density, orders, tags, measurement }) => {
                    const scale =
                      measurement && scales ? scales.get(measurement.id) : null;

                    return (
                      <div key={id}>
                        <div>
                          {name.length > 50 ? (
                            <h4 title={name}>
                              {name.substring(0, 50)}
                              ...
                            </h4>
                          ) : (
                            <h4>{name}</h4>
                          )}
                          {scale ? (
                            <small>
                              {scale.isMass
                                ? massToVolume(
                                    sumBy(orders, o => o.amount),
                                    scale.amount,
                                    density
                                  )
                                : sumBy(orders, o => o.amount) /
                                  scale.amount}{" "}
                              {scale.name}
                            </small>
                          ) : (
                            <small>
                              {sumBy(orders, o => o.amount)} {unit}
                            </small>
                          )}
                        </div>
                        <div>
                          {tags.map(tag => (
                            <small key={tag.id}>{tag.name}</small>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </ClassViewGridContainer>
              {ids.length === 1 && (
                <PaginationContainer>
                  <Pagination
                    value={page}
                    total={pageCount}
                    onChange={page => this.setState({ page })}
                  />
                </PaginationContainer>
              )}
            </Fragment>
          ) : (
            <NoIngredientsContainer>
              <UndrawNoData height="200px" />
              <h3>No Ingredients match the criteria</h3>
              {isSummary && (
                <small>
                  Note: this could mean that no ingredients have been ordered
                  yet
                </small>
              )}
            </NoIngredientsContainer>
          );
        }}
      </Query>
    );
  }
}

export default ClassViewGrid;

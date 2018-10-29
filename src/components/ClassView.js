import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { css } from "emotion";
import { CLASS_VIEW_QUERY } from "../queries";
import ClassViewGrid from "./ClassViewGrid";
import Spinner from "./Spinner";
import { fullPage, bar, noPrint } from "../styles";
import UndrawFileSearching from "./svg/UndrawFileSearching";
import Button from "@atlaskit/button";
import { CheckboxSelect, RadioSelect } from "@atlaskit/select";
import InlineDialog from "@atlaskit/inline-dialog";
import Close from "./svg/Close";
import { Link } from "react-router-dom";
import Toggle from "./Toggle";

class ClassView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      filterValues: [],
      filterTimeoutID: null,
      filterDialogOpen: false,
      filteredUsers: null,
      orderBy: "createdAt_DESC",
      isSummary: false,
      summaryDialogOpen: false
    };
  }

  render() {
    const { match, history } = this.props;
    const { id } = match.params;

    const {
      inputValue,
      filterValues,
      filterTimeoutID,
      filterDialogOpen,
      filteredUsers,
      orderBy,
      isSummary,
      summaryDialogOpen
    } = this.state;

    return (
      <div
        className={css`
          position: relative;
          height: 100%;

          display: grid;
          grid-template-columns: 1fr 250px;

          & > div {
            overflow: auto;
          }
        `}
      >
        <Query query={CLASS_VIEW_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;

            if (error) return <div>Error</div>;

            const { classes } = data;

            // I don't think 'class' is a valid variable name ... so 'appropriateClass'
            const appropriateClass = classes.find(c => c.id == id);
            // console.log("class", appropriateClass);
            const users = [
              appropriateClass.teacher,
              ...appropriateClass.students
            ];

            return appropriateClass ? (
              <Fragment>
                <div>
                  <div
                    className={css`
                      ${bar};
                      background-color: white;
                      position: sticky;
                      top: 0;

                      z-index: 1;
                    `}
                  >
                    <Link
                      to="/"
                      className={css`
                        height: 40px;
                        width: 40px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        transition: all 0.3s ease;
                        background-color: rgb(220, 220, 220);
                        border-radius: 50%;
                        position: fixed;
                        left: 70px;
                        top: 10px;

                        &:hover {
                          background-color: rgb(180, 180, 180);
                        }
                      `}
                    >
                      <Close />
                    </Link>
                    <h2>{appropriateClass.name}</h2>
                  </div>
                  <ClassViewGrid
                    id={id}
                    orderBy={orderBy}
                    filter={filterValues}
                    filteredUsers={filteredUsers || users.map(user => user.id)}
                    isSummary={isSummary}
                  />
                </div>
                <div
                  className={css`
                    ${noPrint};
                    text-align: center;
                    padding: 10px;

                    & > div {
                      margin-top: 35px;

                      & > h4 {
                        margin: 5px;
                      }
                    }
                  `}
                >
                  <div>
                    <input
                      id="filter"
                      type="text"
                      placeholder="Search..."
                      value={inputValue}
                      onChange={event => {
                        const value = event.target.value;

                        window.clearTimeout(filterTimeoutID);

                        this.setState({
                          inputValue: value,
                          filterTimeoutID: window.setTimeout(
                            () =>
                              this.setState({ filterValues: value.split(" ") }),
                            250
                          )
                        });
                      }}
                    />
                  </div>
                  <div>
                    <h4>
                      Summary{" "}
                      <InlineDialog
                        onClose={() => {
                          this.setState({
                            summaryDialogOpen: false
                          });
                        }}
                        content={
                          <p>
                            Turning summary on will only show ingredients that
                            have been ordered
                          </p>
                        }
                        isOpen={summaryDialogOpen}
                      >
                        <Button
                          isSelected={summaryDialogOpen}
                          onClick={() =>
                            this.setState(prevProps => ({
                              summaryDialogOpen: !prevProps.summaryDialogOpen
                            }))
                          }
                        >
                          ?
                        </Button>
                      </InlineDialog>
                    </h4>
                    <Toggle
                      id="summaryToggle"
                      checked={isSummary}
                      onChange={() =>
                        this.setState(prevProps => ({
                          isSummary: !prevProps.isSummary
                        }))
                      }
                    />
                  </div>
                  <div>
                    <h4>
                      Filter Users{" "}
                      <InlineDialog
                        onClose={() => {
                          this.setState({
                            filterDialogOpen: false
                          });
                        }}
                        content={
                          <p>Only show orders from the selected users</p>
                        }
                        isOpen={filterDialogOpen}
                      >
                        <Button
                          isSelected={filterDialogOpen}
                          onClick={() =>
                            this.setState(prevProps => ({
                              filterDialogOpen: !prevProps.filterDialogOpen
                            }))
                          }
                        >
                          ?
                        </Button>
                      </InlineDialog>
                    </h4>
                    <CheckboxSelect
                      className="checkbox-select"
                      classNamePrefix="select"
                      defaultValue={users.map(user => ({
                        label: user.name,
                        value: user.id
                      }))}
                      options={users.map(user => ({
                        label: user.name,
                        value: user.id
                      }))}
                      placeholder="Choose a City"
                      onChange={users =>
                        this.setState({
                          filteredUsers: users.map(u => u.value)
                        })
                      }
                    />
                  </div>
                  <div>
                    <h4>Sort Ingredients</h4>
                    <RadioSelect
                      className="radio-select"
                      classNamePrefix="react-select"
                      defaultValue={{
                        label: "Newest (ascending)",
                        value: "createdAt_DESC"
                      }}
                      options={[
                        { label: "Name (ascending)", value: "name_ASC" },
                        { label: "Name (descending)", value: "name_DESC" },
                        { label: "Unit (ascending)", value: "unit_ASC" },
                        { label: "Unit (descending)", value: "unit_DESC" },
                        { label: "Oldest (ascending)", value: "createdAt_ASC" },
                        {
                          label: "Newest (descending)",
                          value: "createdAt_DESC"
                        }
                      ]}
                      placeholder="Sort by..."
                      onChange={data => this.setState({ orderBy: data.value })}
                    />
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className={fullPage}>
                <UndrawFileSearching height="200px" />
                <h2>Class Not Found!</h2>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default ClassView;

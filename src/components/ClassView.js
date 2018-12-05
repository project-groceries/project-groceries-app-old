import React, { Component, Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import { css } from "emotion";
import { CLASS_VIEW_QUERY, CLEAR_ORDERS_MUTATION } from "../queries";
import ClassViewGrid from "./ClassViewGrid";
import Spinner from "./Spinner";
import { fullPage, bar, noPrint } from "../styles";
import UndrawFileSearching from "./svg/UndrawFileSearching";
import Button from "@atlaskit/button";
import { CheckboxSelect, RadioSelect } from "@atlaskit/select";
import InlineDialog from "@atlaskit/inline-dialog";
import Toggle from "./Toggle";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import DeleteClass from "./DeleteClass";
import Unenrol from "./Unenrol";
import uniqby from "lodash.uniqby";

class ClassView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      filterValues: [],
      filterTimeoutID: null,
      filterClassDialogOpen: false,
      filterDialogOpen: false,
      filteredUsers: null,
      orderBy: "createdAt_DESC",
      isSummary: false,
      summaryDialogOpen: false,
      isDeleteClassModalOpen: false
    };
  }

  render() {
    const { match } = this.props;
    const { id } = match.params;

    const {
      inputValue,
      filterValues,
      filterTimeoutID,
      filterClassDialogOpen,
      filterDialogOpen,
      filteredClasses,
      filteredUsers,
      orderBy,
      isSummary,
      summaryDialogOpen,
      isDeleteClassModalOpen
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

          @media (max-width: 767px) {
            grid-template-columns: 1fr;

            & > div:last-child {
              display: none;
            }
          }
        `}
      >
        <Query query={CLASS_VIEW_QUERY} pollInterval={5000}>
          {({ loading, error, data }) => {
            const hasData = data ? Object.keys(data).length === 2 : undefined;
            if (!hasData && loading) return <Spinner />;

            if (error) return <div>Error</div>;

            const {
              allClasses,
              user: { type }
            } = data;

            // I don't think 'class' is a valid variable name ... so 'appropriateClass'
            const appropriateClass = id
              ? allClasses.find(c => c.id == id)
              : {
                  name: "Summary",
                  users: uniqby(
                    allClasses.reduce(
                      (acc, cur) => [cur.teacher, ...cur.students, ...acc],
                      []
                    ),
                    "id"
                  )
                };
            // console.log("class", appropriateClass);
            const users = appropriateClass
              ? id
                ? [appropriateClass.teacher, ...appropriateClass.students]
                : appropriateClass.users
              : undefined;

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
                    <h2>{appropriateClass.name}</h2>
                  </div>
                  <ClassViewGrid
                    ids={
                      id ? [id] : filteredClasses || allClasses.map(c => c.id)
                    }
                    orderBy={orderBy}
                    filter={filterValues}
                    filteredUsers={filteredUsers || users.map(user => user.id)}
                    isSummary={id ? isSummary : true}
                  />
                </div>
                <div
                  className={css`
                    ${noPrint};
                    text-align: center;
                    padding: 10px;
                    padding-bottom: 100px;

                    & > div {
                      margin-top: 35px;

                      & > h4 {
                        margin: 5px;
                      }
                    }
                  `}
                >
                  {id && (
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
                                this.setState({
                                  filterValues: value.split(" ")
                                }),
                              250
                            )
                          });
                        }}
                      />
                    </div>
                  )}
                  {id && (
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
                            appearance="help"
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
                  )}
                  <div>
                    <h4>Sort Ingredients</h4>
                    <RadioSelect
                      className="radio-select"
                      classNamePrefix="react-select"
                      defaultValue={{
                        label: "Newest",
                        value: "createdAt_DESC"
                      }}
                      options={[
                        {
                          label: "Newest",
                          value: "createdAt_DESC"
                        },
                        { label: "Oldest", value: "createdAt_ASC" },
                        {
                          label: "Alphabetical",
                          value: "name_ASC"
                        },
                        {
                          label: "Alphabetical (descending)",
                          value: "name_DESC"
                        }
                      ]}
                      placeholder="Sort by..."
                      onChange={data => this.setState({ orderBy: data.value })}
                    />
                  </div>
                  {!id && (
                    <div>
                      <h4>
                        Filter Classes{" "}
                        <InlineDialog
                          onClose={() => {
                            this.setState({
                              filterClassDialogOpen: false
                            });
                          }}
                          content={
                            <p>Only show orders from the selected classes</p>
                          }
                          isOpen={filterClassDialogOpen}
                        >
                          <Button
                            isSelected={filterClassDialogOpen}
                            onClick={() =>
                              this.setState(prevProps => ({
                                filterClassDialogOpen: !prevProps.filterClassDialogOpen
                              }))
                            }
                            appearance="help"
                          >
                            ?
                          </Button>
                        </InlineDialog>
                      </h4>
                      <CheckboxSelect
                        className="checkbox-select"
                        classNamePrefix="select"
                        defaultValue={allClasses.map(c => ({
                          label: c.name,
                          value: c.id
                        }))}
                        options={allClasses.map(c => ({
                          label: c.name,
                          value: c.id
                        }))}
                        placeholder="Choose a Class"
                        onChange={classes =>
                          this.setState({
                            filteredClasses: classes.map(c => c.value)
                          })
                        }
                      />
                    </div>
                  )}
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
                          appearance="help"
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
                  {type === "TEACHER" && (
                    <div>
                      <Mutation mutation={CLEAR_ORDERS_MUTATION}>
                        {(mutation, { loading, error }) => {
                          if (error) return <div>Error</div>;

                          return (
                            <Button
                              appearance="warning"
                              onClick={() =>
                                mutation({
                                  variables: {
                                    classIDs: id
                                      ? [id]
                                      : allClasses.map(c => c.id)
                                  }
                                })
                              }
                              isLoading={loading}
                            >
                              Clear Orders
                            </Button>
                          );
                        }}
                      </Mutation>
                    </div>
                  )}
                  {id && (
                    <div>
                      <Button
                        appearance={type === "TEACHER" ? "danger" : "warning"}
                        onClick={() =>
                          this.setState({ isDeleteClassModalOpen: true })
                        }
                      >
                        {type == "TEACHER"
                          ? "Delete Class"
                          : "Unenroll From Class"}
                      </Button>
                      <ModalTransition>
                        {isDeleteClassModalOpen && (
                          <Modal
                            actions={[
                              {
                                text: "Close",
                                onClick: () =>
                                  this.setState({
                                    isDeleteClassModalOpen: false
                                  })
                              }
                            ]}
                            onClose={() =>
                              this.setState({
                                isDeleteClassModalOpen: false
                              })
                            }
                            heading={
                              type == "TEACHER"
                                ? "Delete Class"
                                : "Unenroll From Class"
                            }
                          >
                            {type === "TEACHER" ? (
                              <DeleteClass id={id} />
                            ) : (
                              <Unenrol id={id} />
                            )}
                          </Modal>
                        )}
                      </ModalTransition>
                    </div>
                  )}
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

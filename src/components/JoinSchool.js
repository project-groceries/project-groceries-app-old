import React, { Component, Fragment } from "react";
import { Query, Mutation } from "react-apollo";
// import Select from "react-select";
import { withToastManager } from "react-toast-notifications";
import {
  JOIN_SCHOOL_MUTATION,
  FIND_SCHOOLS_QUERY,
  CREATE_SCHOOL_MUTATION
} from "../queries";
import CreatableSelect from "react-select/lib/Creatable";
import Spinner from "./Spinner";
import { css } from "emotion";
import Button from "@atlaskit/button";

class JoinSchool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      create: false
    };
  }

  render() {
    const { toastManager } = this.props;
    const { selectedOption, create } = this.state;

    return (
      <Fragment>
        <Query query={FIND_SCHOOLS_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;
            if (error) return <div>Error</div>;

            const { schools } = data;
            const options = schools.map(s => ({
              value: s.id,
              label: s.name
            }));

            return (
              <div
                className={css`
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;

                  & > * {
                    margin: 10px;
                  }
                `}
              >
                <h3>Next Step: Find Your School</h3>
                <CreatableSelect
                  placeholder="Search for your school or create it"
                  autoFocus={true}
                  isClearable
                  onChange={this.handleChange}
                  // onInputChange={this.handleInputChange}
                  options={options}
                  maxMenuHeight={200}
                  styles={{
                    container: provided => ({
                      ...provided,
                      width: "300px"
                    })
                  }}
                />
                <Mutation
                  mutation={
                    create ? CREATE_SCHOOL_MUTATION : JOIN_SCHOOL_MUTATION
                  }
                  onCompleted={this.onCompleted}
                >
                  {(mutation, { loading }) => {
                    return (
                      <Button
                        appearance="primary"
                        onClick={() => {
                          if (selectedOption) {
                            const { value, label } = selectedOption;
                            const variables = create
                              ? { name: label }
                              : { id: value };
                            mutation({ variables });
                          } else {
                            toastManager.add("Please select a school", {
                              appearance: "warning",
                              autoDismiss: true
                            });
                          }
                        }}
                        isLoading={loading}
                      >
                        {create ? "Create" : "Join"} School
                      </Button>
                    );
                  }}
                </Mutation>
              </div>
            );
          }}
        </Query>
      </Fragment>
    );
  }

  handleChange = (newValue, actionMeta) => {
    // console.group("Value Changed");
    // console.log(newValue);
    // console.log(`action: ${actionMeta.action}`);
    // console.log(actionMeta.action === "select-option");
    // console.groupEnd();

    switch (actionMeta.action) {
      case "select-option":
        this.setState({ selectedOption: newValue, create: false });
        break;
      case "create-option":
        this.setState({ selectedOption: newValue, create: true });
        break;
      case "clear":
        this.setState({ selectedOption: null });
        break;
      default:
        break;
    }
  };

  onCompleted = () => {
    const { toastManager } = this.props;
    const { selectedOption, create } = this.state;
    const { label } = selectedOption;

    window.mixpanel.track(create ? "Created a school" : "Joined a school");

    this.setState({ loading: false });
    toastManager.add(
      `🏫 You have successfully ${create ? "created" : "joined"} "${label}"`,
      {
        appearance: "success",
        autoDismiss: true
      }
    );
  };
}

export default withToastManager(JoinSchool);

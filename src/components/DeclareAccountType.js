import React, { Component, Fragment } from "react";
import Select from "react-select";
import { Mutation } from "react-apollo";
import { withToastManager } from "react-toast-notifications";
import { DECLARE_ACCOUNT_TYPE_MUTATION } from "../queries";

import { FieldTextStateless } from "@atlaskit/field-text";
import Banner from "@atlaskit/banner";

class DeclareAccountType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      errorMessage: false,
      type: null,
      teacherCode: ""
    };
  }

  render() {
    const { /*loading, error,*/ errorMessage, type, teacherCode } = this.state;

    return (
      <main className="flex-center" style={{ height: "100%" }}>
        <div
          className="card card--w-fluid pad-children"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        >
          <div>
            <h1>Almost there</h1>
            <p>Confirm whether you are a teacher or student.</p>
          </div>
          {/* {loading ? (
            <div id="spinner" className="card">
              <div className="spinner">
                <div className="bounce1" />
                <div className="bounce2" />
                <div className="bounce3" />
              </div>
            </div>
          ) : ( */}
          <Mutation
            mutation={DECLARE_ACCOUNT_TYPE_MUTATION}
            onCompleted={this._onCompleted}
            onError={error => this._announceError(error)}
          >
            {(mutation, { loading, error }) =>
              loading ? (
                <div id="spinner" className="card">
                  <div className="spinner">
                    <div className="bounce1" />
                    <div className="bounce2" />
                    <div className="bounce3" />
                  </div>
                </div>
              ) : (
                <Fragment>
                  {/* {error && (
                    <div>
                      <p>Error => {errorMessage}</p>
                    </div>
                    )} */}
                  <div>
                    <Banner isOpen={error} appearance="warning">
                      Invalid Teacher Code
                    </Banner>
                  </div>
                  <div className="form__group">
                    <Select
                      onChange={selectedOption => {
                        const { value } = selectedOption;

                        this.setState({ type: value });
                        if (value === "STUDENT") {
                          this.setState({ loading: true });
                          mutation({ variables: { type: value, teacherCode } });
                        }
                      }}
                      options={[
                        {
                          value: "STUDENT",
                          label: "Student"
                        },
                        {
                          value: "TEACHER",
                          label: "Teacher"
                        }
                      ]}
                      defaultValue={
                        type && {
                          value: type,
                          label: type[0] + type.slice(1).toLowerCase()
                        }
                      }
                      autoFocus={true}
                      aria-label="Select your account type"
                      placeholder="I am a..."
                    />
                    {type === "TEACHER" && (
                      <FieldTextStateless
                        label="Teacher Code"
                        onChange={e =>
                          this.setState({ teacherCode: e.target.value })
                        }
                        value={teacherCode}
                        required
                      />
                    )}
                  </div>
                  {type === "TEACHER" && (
                    <div>
                      <button
                        className="default"
                        onClick={() => {
                          this.setState({ loading: true });
                          mutation({ variables: { type, teacherCode } });
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </Fragment>
              )
            }
          </Mutation>
          {/* )} */}
          <small>
            NOTE: you can change your account type in the future from the
            settings page
          </small>
        </div>
      </main>
    );
  }

  _announceError = async error => {
    // const { toastManager } = this.props;

    this.setState({
      loading: false,
      error: true,
      errorMessage: error.message.replace("GraphQL error: ", "")
    });

    console.log("Ther be an error");
    console.log(error);
    // toastManager.add("An error occurred", {
    //   appearance: "error",
    //   autoDismiss: true
    // });
  };

  _onCompleted = data => {
    const { toastManager } = this.props;
    const { type } = data.declareAccountType.type;

    toastManager.add(`🎉 Awesome! You are officially a ${type.toLowerCase()}`, {
      appearance: "success",
      autoDismiss: true
    });
  };
}

export default withToastManager(DeclareAccountType);

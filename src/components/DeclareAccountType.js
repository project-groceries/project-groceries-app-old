import React, { Component } from "react";
import Select from "react-select";
import { Mutation } from "react-apollo";
import { withToastManager } from "react-toast-notifications";
import { DECLARE_ACCOUNT_TYPE_MUTATION } from "../queries";

class DeclareAccountType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  render() {
    const { loading } = this.state;

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

          {loading ? (
            <div id="spinner" className="card">
              <div className="spinner">
                <div className="bounce1" />
                <div className="bounce2" />
                <div className="bounce3" />
              </div>
            </div>
          ) : (
            <Mutation
              mutation={DECLARE_ACCOUNT_TYPE_MUTATION}
              onCompleted={this._onCompleted}
              onError={this._onError}
            >
              {mutation => (
                <div className="form__group">
                  <Select
                    onChange={selectedOption => {
                      const { value } = selectedOption;

                      this.setState({ loading: true });
                      mutation({ variables: { type: value } });
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
                    autoFocus={true}
                    aria-label="Select your account type"
                    placeholder="I am a..."
                  />
                </div>
              )}
            </Mutation>
          )}

          <small>
            NOTE: you can change your account type in the future from the
            settings page
          </small>
        </div>
      </main>
    );
  }

  _onCompleted = data => {
    const { toastManager } = this.props;
    const { type } = data.declareAccountType.type;

    toastManager.add(`🎉 Awesome! You are officially a ${type.toLowerCase()}`, {
      appearance: "success",
      autoDismiss: true
    });
  };

  _onError = error => {
    const { toastManager } = this.props;

    this.setState({ loading: false });
    console.log(error);
    toastManager.add("An error occurred", {
      appearance: "error",
      autoDismiss: true
    });
  };
}

export default withToastManager(DeclareAccountType);

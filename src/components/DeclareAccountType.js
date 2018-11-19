import React, { Component, Fragment } from "react";
import Select from "react-select";
import { Mutation } from "react-apollo";
import { DECLARE_ACCOUNT_TYPE_MUTATION } from "../queries";

import Banner from "@atlaskit/banner";
import Spinner from "./Spinner";
import { FlagContext } from "../flag-context";

class DeclareAccountType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: null
    };
  }

  render() {
    const { type } = this.state;

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
          <FlagContext.Consumer>
            {({ addFlag }) => (
              <Mutation
                mutation={DECLARE_ACCOUNT_TYPE_MUTATION}
                onCompleted={data => this._onCompleted(data, addFlag)}
              >
                {(mutation, { loading, error }) =>
                  loading ? (
                    <Spinner />
                  ) : (
                    <Fragment>
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
                      </div>
                    </Fragment>
                  )
                }
              </Mutation>
            )}
          </FlagContext.Consumer>
          <small>
            NOTE: you can change your account type in the future from the
            settings page
          </small>
        </div>
      </main>
    );
  }

  _onCompleted = (data, addFlag) => {
    const { type } = data.declareAccountType.type;

    addFlag({
      type: "success",
      title: "🎉 Awesome!",
      description: `You are officially a ${type.toLowerCase()}`
    });
  };
}

export default DeclareAccountType;

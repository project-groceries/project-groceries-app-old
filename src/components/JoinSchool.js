import React, { Component, Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import Select from "react-select";
import { withToastManager } from "react-toast-notifications";
import { JOIN_SCHOOL_MUTATION, FIND_SCHOOLS_QUERY } from "../queries";

class JoinSchool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      loading: false
    };
  }

  render() {
    const { toastManager } = this.props;
    const { selectedOption, loading } = this.state;

    return (
      <Fragment>
        {loading && (
          <div id="spinner" className="card">
            <div className="spinner">
              <div className="bounce1" />
              <div className="bounce2" />
              <div className="bounce3" />
            </div>
          </div>
        )}
        <Mutation
          mutation={JOIN_SCHOOL_MUTATION}
          onCompleted={this._success}
          onError={this._announceError}
        >
          {mutation => (
            <form
              onSubmit={e => {
                e.preventDefault();

                if (selectedOption) {
                  const { value } = selectedOption;
                  this.setState({
                    success: false,
                    error: false,
                    loading: true
                  });
                  mutation({ variables: { id: value } });
                } else {
                  toastManager.add("Please select a school", {
                    appearance: "warning",
                    autoDismiss: true
                  });
                }
              }}
            >
              <Query query={FIND_SCHOOLS_QUERY}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Loading schools...</p>;
                  if (error) this._announceError(error);

                  const { schools } = data;
                  const options = schools.map(s => ({
                    value: s.id,
                    label: s.name
                  }));

                  return schools.length ? (
                    <Fragment>
                      <div className="form__group">
                        <Select
                          onChange={this._handleChange}
                          options={options}
                          autoFocus={true}
                          aria-label="Search for your school"
                        />
                      </div>
                      <button type="submit" className="btn info">
                        Join School
                      </button>
                    </Fragment>
                  ) : (
                    <p>There are no schools at the moment</p>
                  );
                }}
              </Query>
            </form>
          )}
        </Mutation>
      </Fragment>
    );
  }

  _handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  _announceError = async () => {
    const { toastManager } = this.props;

    this.setState({ loading: false });
    toastManager.add("An error occurred", {
      appearance: "error",
      autoDismiss: true
    });
  };

  _success = () => {
    const { toastManager } = this.props;
    const { label } = this.state.selectedOption;

    this.setState({ loading: false });
    toastManager.add(`🏫 Boo Yah! You have successfully joined "${label}"`, {
      appearance: "success",
      autoDismiss: true
    });
  };
}

export default withToastManager(JoinSchool);

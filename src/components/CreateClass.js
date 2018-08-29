import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { withToastManager } from "react-toast-notifications";
import { CREATE_CLASS_QUERY, CREATE_CLASS_MUTATION } from "../queries";

class CreateClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      mutationLoading: false
    };
  }

  render() {
    const { name, mutationLoading } = this.state;

    return (
      <Query query={CREATE_CLASS_QUERY}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <div id="spinner" className="card">
                <div className="spinner">
                  <div className="bounce1" />
                  <div className="bounce2" />
                  <div className="bounce3" />
                </div>
              </div>
            );
          if (error) return <span>Error</span>;

          const { classes } = data.user;

          return mutationLoading ? (
            <div id="spinner" className="card">
              <div className="spinner">
                <div className="bounce1" />
                <div className="bounce2" />
                <div className="bounce3" />
              </div>
            </div>
          ) : (
            <Mutation
              mutation={CREATE_CLASS_MUTATION}
              onCompleted={this._success}
              onError={this._announceError}
            >
              {mutation => {
                return (
                  <form
                    className="pad-children"
                    onSubmit={e => {
                      e.preventDefault();
                      this.setState({
                        mutationLoading: true
                      });

                      if (name) {
                        mutation({ variables: { name } });
                      }
                    }}
                  >
                    <h2>Create {classes.length ? "a" : "your first"} class</h2>
                    <div className="form__group">
                      <label htmlFor="name">Class Name</label>
                      <input
                        id="name"
                        value={name}
                        onChange={e => this.setState({ name: e.target.value })}
                        type="text"
                        placeholder="Year 8 Home Ec"
                        required={true}
                      />
                    </div>
                    <button type="submit" className="btn info">
                      Create Class
                    </button>
                  </form>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }

  _announceError = async () => {
    const { toastManager } = this.props;

    this.setState({ mutationLoading: false });
    toastManager.add("An error occurred", {
      appearance: "error",
      autoDismiss: true
    });
  };

  _success = async () => {
    const { toastManager } = this.props;

    this.setState({ mutationLoading: false });
    toastManager.add("Class created successfully", {
      appearance: "success",
      autoDismiss: true
    });
  };
}

export default withToastManager(CreateClass);

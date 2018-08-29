import React, { Component, Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import Select from "react-select";
import { ENROL_QUERY, ENROL_INTO_CLASS_MUTATION } from "../queries";

class Enrol extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      mutationLoading: false
    };
  }

  render() {
    const { selectedOption, mutationLoading } = this.state;

    return (
      <Query query={ENROL_QUERY}>
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

          const { enrolledIn, school } = data.user;
          const { users: teachers } = school;
          const allClasses = teachers.reduce(
            (prev, cur) => [...prev, ...cur.classes],
            []
          );
          const unenrolledClasses = allClasses.filter(
            c => !enrolledIn.some(ec => ec.id === c.id)
          );
          const options = unenrolledClasses.map(c => ({
            value: c.id,
            label: c.name
          }));
          console.log("unenrolledClasses", unenrolledClasses);

          return allClasses.length ? (
            unenrolledClasses.length ? (
              <Fragment>
                {mutationLoading && (
                  <div id="spinner" className="card">
                    <div className="spinner">
                      <div className="bounce1" />
                      <div className="bounce2" />
                      <div className="bounce3" />
                    </div>
                  </div>
                )}
                <Mutation
                  mutation={ENROL_INTO_CLASS_MUTATION}
                  onCompleted={this._success}
                  onError={this._announceError}
                >
                  {mutation => (
                    <form
                      className="pad-children"
                      onSubmit={e => {
                        e.preventDefault();

                        if (selectedOption) {
                          const { value } = selectedOption;
                          this.setState({
                            mutationLoading: true
                          });
                          mutation({ variables: { id: value } });
                        }
                      }}
                    >
                      <Fragment>
                        <div className="form__group">
                          <Select
                            onChange={this._handleChange}
                            options={options}
                            autoFocus={true}
                            aria-label="Select a class"
                            placeholder="Select a class"
                          />
                        </div>
                        <button type="submit" className="btn info">
                          Enrol into class
                        </button>
                      </Fragment>
                    </form>
                  )}
                </Mutation>
              </Fragment>
            ) : (
              <p>There are no other classes to enrol into.</p>
            )
          ) : (
            <p>
              It seems there are no classes to enrol into yet.
              <span role="img" aria-label="shrug emoji">
                🤷
              </span>
            </p>
          );
        }}
      </Query>
    );
  }

  _handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  _announceError = async () => {
    this.setState({ mutationLoading: false });
  };

  _success = () => {
    this.setState({ mutationLoading: false });
  };
}

export default Enrol;

import React, { Component } from "react";
import JoinSchool from "./JoinSchool";
import CreateSchool from "./CreateSchool";

class NoSchool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      join: true // switch between joining and creating a school
    };
  }

  render() {
    const { join } = this.state;

    return (
      <main className="flex-center" style={{ height: "100%" }}>
        <div
          className="card card--w-fluid pad-children"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        >
          <div>
            <h3>Next Step:</h3>
            <p>Find your school</p>
          </div>
          {join ? <JoinSchool /> : <CreateSchool />}
          <div>
            <small>
              {join
                ? "Can't find your school? "
                : "Does your school already exist? "}
            </small>
            <input
              type="button"
              value={join ? "Create it" : "Join it"}
              onClick={() => {
                this.setState({ join: !join });
              }}
            />
          </div>
        </div>
      </main>
    );
  }
}

export default NoSchool;

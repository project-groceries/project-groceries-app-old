import React, { Component } from "react";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import { CLASSES_GRID_QUERY } from "../queries";
import Spinner from "./Spinner";
import { css } from "emotion";
import Add from "./svg/Add";

const classesGrid = css`
  padding: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & > * {
    margin: 10px;
  }

  & > a > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    padding: 10px;
    width: 250px;
    height: 90px;

    box-shadow: rgba(0, 0, 0, 0.14) 0 2px 2px 0;
    background-color: #f1f1f1;
    transition: all 0.1s ease;
  }

  & > a > div:hover {
    transform: scale(1.05);
  }

  & > a > div > div {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }

  & svg {
    height: 60px;
    transition: all 0.1s ease;
  }

  & svg:hover {
    transform: scale(1.4);
  }
`;

class ClassesGrid extends Component {
  render() {
    return (
      <Query query={CLASSES_GRID_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <p>Error</p>;

          const { type, classes, enrolledIn } = data.user;
          const userClasses = type === "TEACHER" ? classes : enrolledIn;

          return (
            <div className={classesGrid}>
              {userClasses.map(c => (
                <Link to={`/classes/${c.id}`} key={c.id}>
                  <div>
                    <h3>{c.name}</h3>
                    <div>
                      <small>{c.teacher.name}</small>
                      <small>{c.students.length} Students</small>
                    </div>
                  </div>
                </Link>
              ))}
              <Link to="/unknown">
                <Add />
              </Link>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default ClassesGrid;

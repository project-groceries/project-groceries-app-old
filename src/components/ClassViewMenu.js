import React, { Component, Fragment } from "react";
import { css } from "emotion";
import { Dialog } from "@reach/dialog";

import { circleIcon, fullCheck } from "../styles";
import Unenrol from "./Unenrol";
import DeleteClass from "./DeleteClass";
import Menu from "./svg/Menu";
import Visibility from "./svg/Visibility";
import VisibilityOff from "./svg/VisibilityOff";

const menu = css`
  width: 250px;
  background-color: whitesmoke;
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  transition: all 0.3s ease;
  transform: translateX(250px);
  overflow: auto;
`;

const menuOpen = css`
  transform: none;
`;

class ClassViewMenu extends Component {
  constructor(props) {
    super(props);

    this.state = { menuIsOpen: false, isUnenrolModalOpen: false };
  }

  render() {
    const { id, type, tags, appropriateClass, classUsers } = this.props;
    const { menuIsOpen, isUnenrolModalOpen } = this.state;

    return (
      <Fragment>
        <div
          className={css`
            ${circleIcon};
            position: fixed;
            right: 10px;
            ${menuIsOpen ? "transform: translateX(-250px);" : ""};
          `}
          onClick={() =>
            this.setState(prevState => ({
              menuIsOpen: !prevState.menuIsOpen
            }))
          }
        >
          <Menu />
        </div>
        <div
          className={css`
            ${menu};
            ${menuIsOpen ? menuOpen : ""};
            z-index: 2;
          `}
        >
          <div
            className={css`
              margin: 10px;
            `}
          >
            {tags.length ? (
              <Fragment>
                <h3>Filter ingredients by tag</h3>
                <small>
                  ⓘ Only show ingredients that have the selected tags
                </small>
                <div className={fullCheck}>
                  <input
                    id="filter-tag-undefined"
                    name="filter-tag-undefined"
                    type="checkbox"
                    defaultChecked={true}
                    onChange={e => {
                      // checked={this.state.isGoing}
                      const value = e.target.checked;

                      this.setState(prevState => {
                        prevState.hiddentTags.set(undefined, !value);

                        return { hiddentTags: prevState.hiddentTags };
                      });
                    }}
                  />
                  <label htmlFor="filter-tag-undefined">
                    <Visibility />
                    <VisibilityOff />
                    <span>No Tags</span>
                  </label>
                </div>
                {tags.map(tag => (
                  <div key={tag.id} className={fullCheck}>
                    <input
                      id={`filter-tag-${tag.id}`}
                      name={`filter-tag-${tag.id}`}
                      type="checkbox"
                      defaultChecked={true} // checked={this.state.isGoing}
                      onChange={e => {
                        const value = e.target.checked;

                        this.setState(prevState => {
                          prevState.hiddentTags.set(tag.id, !value);

                          return { hiddentTags: prevState.hiddentTags };
                        });
                      }}
                    />
                    <label htmlFor={`filter-tag-${tag.id}`}>
                      <Visibility />
                      <VisibilityOff />
                      <span>{tag.name}</span>
                    </label>
                  </div>
                ))}
              </Fragment>
            ) : (
              ""
            )}
            {appropriateClass.students.length ? (
              <Fragment>
                <h3>Filter orders by students</h3>
                <small>ⓘ Only show orders by selected students</small>
                {classUsers.map(user => (
                  <div key={user.id} className={fullCheck}>
                    <input
                      id={`filter-user-${user.id}`}
                      name={`filter-user-${user.id}`}
                      type="checkbox"
                      defaultChecked={true}
                      // checked={this.state.isGoing}
                      onChange={e => {
                        const value = e.target.checked;

                        this.setState(prevState => {
                          prevState.hiddenUsers.set(user.id, !value);

                          return {
                            hiddenUsers: prevState.hiddenUsers
                          };
                        });
                      }}
                    />
                    <label htmlFor={`filter-user-${user.id}`}>
                      <Visibility />
                      <VisibilityOff />
                      <span>{user.name}</span>
                    </label>
                  </div>
                ))}
              </Fragment>
            ) : (
              ""
            )}
          </div>
          <button
            className="default"
            style={{ position: "absolute", bottom: "30px", left: "-150px" }}
            onClick={() => window.print()}
          >
            Print
          </button>
          <input
            type="button"
            value={`${
              type === "TEACHER" ? "Delete" : "Unenroll from"
            } this class`}
            className={type === "TEACHER" ? "error" : "warning"}
            onClick={this._toggleUnenrolModal}
            style={{ position: "fixed", bottom: "10px", right: "10px" }}
          />
          <Dialog isOpen={isUnenrolModalOpen}>
            <button
              className="close-button"
              onClick={() =>
                this.setState({
                  isUnenrolModalOpen: false
                })
              }
            >
              <span aria-hidden>×</span>
            </button>
            {type === "TEACHER" ? (
              <DeleteClass
                id={id}
                onCompleted={() => this.setState({ isUnenrolModalOpen: false })}
              />
            ) : (
              <Unenrol
                id={id}
                onCompleted={() => this.setState({ isUnenrolModalOpen: false })}
              />
            )}
          </Dialog>
        </div>
      </Fragment>
    );
  }
}

export default ClassViewMenu;

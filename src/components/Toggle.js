import React, { Component } from "react";
import { css } from "emotion";

class Toggle extends Component {
  render() {
    const { id, checked, onChange, width } = this.props;

    return (
      <div
        className={css`
          display: flex;
          flex-direction: column;
          align-items: center;

          .tgl {
            display: none;

            // add default box-sizing for this scope
            &,
            &:after,
            &:before,
            & *,
            & *:after,
            & *:before,
            & + .tgl-btn {
              box-sizing: border-box;
              &::selection {
                background: none;
              }
            }

            + .tgl-btn {
              outline: 0;
              display: block;
              width: ${width || "4em"};
              height: 2em;
              position: relative;
              cursor: pointer;
              user-select: none;
              &:after,
              &:before {
                position: relative;
                display: block;
                content: "";
                width: 50%;
                height: 100%;
              }

              &:after {
                left: 0;
              }

              &:before {
                display: none;
              }
            }

            &:checked + .tgl-btn:after {
              left: 50%;
            }
          }

          .tgl-light {
            + .tgl-btn {
              background: #f0f0f0;
              border-radius: 2em;
              padding: 2px;
              transition: all 0.4s ease;
              &:after {
                border-radius: 2em;
                background: #fff;
                transition: all 0.2s ease;
              }
            }

            &:checked + .tgl-btn {
              background: #9fd6ae;
            }
          }
        `}
      >
        <input
          className="tgl tgl-light"
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <label className="tgl-btn" htmlFor={id} />
      </div>
    );
  }
}

export default Toggle;

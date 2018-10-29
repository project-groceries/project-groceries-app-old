import React, { Component } from "react";
import { css } from "emotion";

const canToggle = css`
  position: relative;
  display: flex;
  justify-content: center;

  & *,
  & *:before,
  & *:after {
    box-sizing: border-box;
  }
  & input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
  }
  & input[type="checkbox"][disabled] ~ label {
    pointer-events: none;
  }
  & input[type="checkbox"][disabled] ~ label .can-toggle__switch {
    opacity: 0.4;
  }
  & input[type="checkbox"]:checked ~ label .can-toggle__switch:before {
    content: attr(data-unchecked);
    left: 0;
  }
  & input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
    content: attr(data-checked);
  }
  & label {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    display: flex;
    align-items: center;
    width: 200px;
  }
  & label .can-toggle__label-text {
    flex: 1;
    padding-left: 32px;
  }
  & label .can-toggle__switch {
    position: relative;
  }
  & label .can-toggle__switch:before {
    content: attr(data-checked);
    position: absolute;
    top: 0;
    text-transform: uppercase;
    text-align: center;
  }
  & label .can-toggle__switch:after {
    content: attr(data-unchecked);
    position: absolute;
    z-index: 5;
    text-transform: uppercase;
    text-align: center;
    background: white;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  & input[type="checkbox"][disabled] ~ label {
    color: rgba(119, 119, 119, 0.5);
  }
  & input[type="checkbox"]:focus ~ label .can-toggle__switch,
  & input[type="checkbox"]:hover ~ label .can-toggle__switch {
    background-color: #777;
  }
  & input[type="checkbox"]:focus ~ label .can-toggle__switch:after,
  & input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
    color: #5e5e5e;
  }
  & input[type="checkbox"]:hover ~ label {
    color: #6a6a6a;
  }
  & input[type="checkbox"]:checked ~ label:hover {
    color: #55bc49;
  }
  & input[type="checkbox"]:checked ~ label .can-toggle__switch {
    background-color: #70c767;
  }
  & input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
    color: #4fb743;
  }
  & input[type="checkbox"]:checked:focus ~ label .can-toggle__switch,
  & input[type="checkbox"]:checked:hover ~ label .can-toggle__switch {
    background-color: #5fc054;
  }
  & input[type="checkbox"]:checked:focus ~ label .can-toggle__switch:after,
  & input[type="checkbox"]:checked:hover ~ label .can-toggle__switch:after {
    color: #47a43d;
  }
  & label .can-toggle__label-text {
    flex: 1;
  }
  & label .can-toggle__switch {
    transition: background-color 0.3s cubic-bezier(0, 1, 0.5, 1);
    background: #848484;
  }
  & label .can-toggle__switch:before {
    color: rgba(255, 255, 255, 0.5);
  }
  & label .can-toggle__switch:after {
    transition: -webkit-transform 0.3s cubic-bezier(0, 1, 0.5, 1);
    transition: transform 0.3s cubic-bezier(0, 1, 0.5, 1);
    transition: transform 0.3s cubic-bezier(0, 1, 0.5, 1),
      -webkit-transform 0.3s cubic-bezier(0, 1, 0.5, 1);
    color: #777;
  }
  & input[type="checkbox"]:focus ~ label .can-toggle__switch:after,
  & input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
  }
  & input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
    -webkit-transform: translate3d(calc(100% - 4px), 0, 0);
    transform: translate3d(calc(100% - 4px), 0, 0);
  }
  & input[type="checkbox"]:checked:focus ~ label .can-toggle__switch:after,
  & input[type="checkbox"]:checked:hover ~ label .can-toggle__switch:after {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
  }
  & label {
    font-size: 14px;
  }
  & label .can-toggle__switch {
    height: 36px;
    flex: 1;
    border-radius: 4px;
  }
  & label .can-toggle__switch:before {
    left: 50%;
    font-size: 12px;
    line-height: 36px;
    width: 50%;
    padding: 0 12px;
  }
  & label .can-toggle__switch:after {
    top: 2px;
    left: 2px;
    border-radius: 2px;
    width: 50%;
    line-height: 32px;
    font-size: 12px;
  }
  & input:checked + label .can-toggle__switch:before {
    left: 2px;
  }
  & label .can-toggle__switch:hover:after {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
  }
`;

class TextToggle extends Component {
  render() {
    const { id, checked, onChange, checkedText, uncheckedText } = this.props;

    return (
      <div className={canToggle}>
        <input id={id} type="checkbox" checked={checked} onChange={onChange} />
        <label htmlFor={id}>
          <div
            className="can-toggle__switch"
            data-checked={checkedText || "checked"}
            data-unchecked={uncheckedText || "unchecked"}
          />
          {/* <div className="can-toggle__label-text">.can-toggle</div> */}
        </label>
      </div>
    );
  }
}

export default TextToggle;

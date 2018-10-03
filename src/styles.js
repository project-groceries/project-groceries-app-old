import { css } from "emotion";

export const fullPage = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const overviewSection = css`
  padding: 10px;
  // margin: 10px;
`;

export const loaderContainer = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const bar = css`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 40px;
`;

export const circleIcon = css`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: rgb(220, 220, 220);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  position: absolute;
  // top: 10px;
  // right: 10px;

  &:hover {
    cursor: pointer;
    background-color: rgb(180, 180, 180);
  }

  // & svg {
  //   height: 40px;
  // }
`;

export const orderItem = css`
  background-color: #f1f1f1;
  box-shadow: rgba(0, 0, 0, 0.14) 0 2px 2px 0;

  display: flex;
  // flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  margin: 20px 5px;

  & input {
    width: 40px;
    margin: 5px;
  }

  & > *:not(svg) {
    flex: 1;
    text-align: center;
  }

  & > svg {
    fill: #c9c9c9;

    margin: 5px;
    padding: 5px;
    // background-color: white;
    // width: 40px;
    height: 40px;
    width: 40px;
    transition: all 0.1s ease;
  }

  & > svg:hover {
    cursor: pointer;
    transform: scale(1.2);
  }
`;

export const noPrint = css`
  @media print {
    display: none;
  }
`;

export const fullCheck = css`
  margin: 20px;

  & > label {
    display: flex;

    padding: 10px;
    margin: 5px;
    min-width: 200px;
    text-align: center;
    box-shadow: 0px 0px 3px 0px #e4e4e4;
    background-color: #eee;

    transition: all 0.3s ease;

    & > * {
      margin: auto 10px;
    }

    svg:nth-of-type(1) {
      display: none;
    }

    svg:nth-of-type(2) {
      display: block;
    }
  }

  & > label:hover {
    cursor: pointer;
  }

  & > input {
    display: none;
  }

  & > input:checked + label {
    background-color: #cacaca;

    svg:nth-of-type(1) {
      display: block;
    }

    svg:nth-of-type(2) {
      display: none;
    }
  }
`;

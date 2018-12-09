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

  height: 90px; // missing 10px are added to the top margin
  margin: 30px 5px 0px 5px; // 30px = 10 left from height + 20 from grid-gap

  // &:nth-child(2) {
  //   margin: 20px 5px 0px 5px;
  // }

  // &:last-child {
  //   margin: 30px 5px 10px 5px;
  // }

  // &:nth-child(2):last-child {
  //   margin: 20px 5px 10px 5px;
  // }

  & > div {
    // height: 40px;
    display: flex;
    // flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  & > div:first-child {
    height: 50px;
  }
  & > div:last-child {
    height: 40px;
  }

  & > div:last-child {
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover > div:last-child {
    opacity: 1;
  }

  & input {
    width: 60px;
    margin: 5px;
  }

  & > div > *:not(svg) {
    flex: 1;
    text-align: center;
  }

  & > div > svg {
    fill: #c9c9c9;

    margin: 5px;
    padding: 5px;
    // background-color: white;
    // width: 40px;
    height: 40px;
    width: 40px;
    transition: all 0.1s ease;
  }

  & > div > svg:hover {
    cursor: pointer;
    // transform: scale(1.2);
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

export const createIngredientsGrid = css`
  // width: 100%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  // grid-auto-flow: column;
  // grid-auto-columns: 80%;

  transition: all 0.3s ease;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    box-shadow: rgba(0, 0, 0, 0.14) 0px 0px 2px 0;
    position: relative; // for the remove icon

    & > span {
      position: absolute;
      top: 5px;
      right: 5px;
    }

    & > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 10px;

      & > div,
      & > input {
        width: 200px;
      }
    }
  }

  & > div[data-correct="true"] {
    box-shadow: rgba(0, 250, 0, 1) 0px 0px 2px 0;
  }

  & > div:last-child {
    transition: all 0.1s ease;
  }

  & > div:last-child:hover {
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.14) 0px 0px 10px 0;
  }

  & svg {
    transition: all 0.1s ease;
  }

  & div:last-child:hover svg {
    transform: scale(1.4);
  }
`;

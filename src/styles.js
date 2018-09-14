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

export const burger = css`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: rgb(220, 220, 220);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  position: fixed;
  top: 10px;
  // right: 10px;

  &:hover {
    cursor: pointer;
    background-color: rgb(180, 180, 180);
  }
`;

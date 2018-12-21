import React, { Component } from "react";
import Select from "react-select";
import styled from "styled-components";
import { Close } from "styled-icons/material";
import Button from "@atlaskit/button";

const CloseIcon = styled(Close)`
  width: 24px;
`;

class CreateIngredients extends Component {
  state = {
    name: "Yolo",
    measurement: null,
    tags: [],
    description: ""
  };

  render() {
    const {
      index,
      ingredient,
      updateValue,
      setMeasurement,
      onlyIngredient,
      removeIngredient
    } = this.props;

    return (
      <div data-correct={Boolean(ingredient.name)}>
        {!onlyIngredient && (
          <span>
            <Button
              appearance="warning"
              spacing="compact"
              onClick={() => removeIngredient(index)}
            >
              <CloseIcon />
            </Button>
          </span>
        )}
        <div>
          <h4>Name</h4>
          <input
            type="text"
            data-name="name"
            data-index={index}
            style={{ height: "50px" }}
            placeholder="Apples"
            value={ingredient.name}
            onChange={updateValue}
          />
        </div>
        <div>
          <h4>Measured by...</h4>
          <Select
            className="radio-select"
            classNamePrefix="react-select"
            isSearchable={false}
            defaultValue={{
              label: "Volume",
              value: "cjos1hvuf3bog0a16wrjjbshx"
            }}
            options={[
              {
                label: "Volume",
                value: "cjos1hvuf3bog0a16wrjjbshx"
              },
              {
                label: "Weight",
                value: "cjos1kt053c310a16c05mt8zy"
              }
            ]}
            onChange={data => setMeasurement(index, data.value)}
          />
        </div>
        {ingredient.measurement === "cjos1kt053c310a16c05mt8zy" && (
          <div>
            <h4>
              Density{" "}
              <small>
                (kg/m<sup>3</sup>)
              </small>
            </h4>
            <input
              type="number"
              data-name="density"
              data-index={index}
              style={{ height: "50px" }}
              value={ingredient.density}
              onChange={updateValue}
            />
            <small>
              ⓘ You can find densities for common ingredients{" "}
              <a
                href="http://www.onlineconversion.com/weight_volume_cooking.htm"
                target="_blank"
              >
                here
              </a>
              .
            </small>
          </div>
        )}
      </div>
    );
  }
}

export default CreateIngredients;

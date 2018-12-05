import React, { Component } from "react";
import { RadioSelect } from "@atlaskit/select";

class CreateIngredients extends Component {
  state = {
    name: "Yolo",
    measurement: null,
    tags: [],
    description: ""
  };

  render() {
    const { index, ingredient, updateValue, setMeasurement } = this.props;

    return (
      <div data-correct={Boolean(ingredient.name)}>
        <div>
          <h4>Name</h4>
          <input
            type="text"
            // name={`name${index}`}
            data-name="name"
            data-index={index}
            // maxLength="45"
            style={{ height: "50px" }}
            placeholder="Apples"
            value={ingredient.name}
            onChange={updateValue}
          />
        </div>
        <div>
          <h4>Measured by...</h4>
          <RadioSelect
            className="radio-select"
            classNamePrefix="react-select"
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
            placeholder="Measured by..."
            // onChange={data => this.setState({ orderBy: data.value })}
            onChange={data => setMeasurement(index, data.value)}
            styles={{
              container: provided => ({ ...provided, width: 250 })
            }}
          />
        </div>
      </div>
    );
  }
}

export default CreateIngredients;

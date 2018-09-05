import React, { Component } from "react";
import PropTypes from "prop-types";

class CreateIngredientsSubForm extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    ingredient: PropTypes.shape({
      name: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired
    }).isRequired,
    remainingTags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    ).isRequired,
    multipleIngredients: PropTypes.bool.isRequired,
    isDuplicate: PropTypes.bool.isRequired,
    removeIngredientSubForm: PropTypes.func.isRequired,
    updateValue: PropTypes.func.isRequired,
    addTag: PropTypes.func.isRequired,
    selectTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired
  };

  render() {
    const {
      index,
      ingredient,
      remainingTags,
      multipleIngredients,
      isDuplicate,
      removeIngredientSubForm,
      updateValue,
      addTag,
      selectTag,
      removeTag
    } = this.props;

    return (
      <div
        className="column pad-children"
        style={{
          padding: "10px",
          margin: "10px",
          minWidth: "250px",
          alignItems: "stretch",
          boxShadow: "0px 0px 3px 0px #e4e4e4",
          position: "relative"
        }}
      >
        {isDuplicate ? (
          <small style={{ color: "red" }}>
            {ingredient.name} has already been added
          </small>
        ) : (
          ""
        )}
        <input type="hidden" name={`isDuplicate${index}`} value={isDuplicate} />
        <button
          type="button"
          id={`RemoveButton${index}`}
          name=""
          className="btn warning"
          style={{
            width: "35px",
            height: "35px",
            position: "absolute",
            borderRadius: "50%",
            top: "-17px",
            left: "-17px"
          }}
          onClick={() => removeIngredientSubForm(index)}
          hidden={!multipleIngredients}
        >
          ✗
        </button>
        <div className="space-between">
          <span>Ingredient Name</span>
          <input
            type={"text"}
            name={`name${index}`}
            data-name="name"
            data-index={index}
            maxLength="45"
            placeholder={"Milk"}
            value={ingredient.name || ""}
            required={true}
            style={{ width: "80px" }}
            onChange={updateValue}
          />
        </div>
        <div className="space-between">
          <span>Measurement Unit</span>
          <input
            type={"text"}
            name={`unit${index}`}
            data-name={"unit"}
            data-index={index}
            maxLength="45"
            placeholder={"Litres"}
            value={ingredient.unit || ""}
            list="unitList"
            required={false}
            style={{ width: "80px" }}
            onChange={updateValue}
            pattern="^(\D)+$"
            title="The unit cannot contain numbers"
          />
        </div>
        <small>No numbers allowed in the unit</small>
        <div className="space-around">
          {ingredient.tags.length ? (
            ingredient.tags.map(
              (t, ti) =>
                t.id ? (
                  <small key={t.id} className="tag">
                    {t.name}
                    <button
                      type="button"
                      className="c-warning"
                      data-index={index}
                      data-tagindex={ti}
                      onClick={removeTag}
                    >
                      {" "}
                      ✗{" "}
                    </button>
                  </small>
                ) : (
                  <select
                    defaultValue=""
                    style={{ width: "150px" }}
                    key={`null${index}${ti}`}
                    data-index={index}
                    data-tagindex={ti}
                    onChange={selectTag}
                  >
                    <option disabled hidden value="">
                      -- select a tag --
                    </option>
                    {remainingTags.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                )
            )
          ) : (
            <small>no tags</small>
          )}
          {remainingTags.length === 0 || ingredient.tags.some(t => !t.id) ? (
            ""
          ) : (
            <button
              type="button"
              className="c-success"
              style={{ marginLeft: "auto" }}
              data-index={index}
              onClick={addTag}
            >
              +
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default CreateIngredientsSubForm;

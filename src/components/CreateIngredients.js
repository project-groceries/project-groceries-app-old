import React from "react";
import CreateIngredientsSubForm from "./CreateIngredientsSubForm";
import { Query, Mutation } from "react-apollo";
import {
  CREATE_INGREDIENTS_QUERY,
  CREATE_INGREDIENTS_MUTATION
} from "../queries";
import Spinner from "./Spinner";
import { withToastManager } from "react-toast-notifications/dist/ToastProvider";

class CreateIngredients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: [
        {
          name: "",
          unit: "",
          tags: []
        }
      ],
      mutationLoading: false
    };
  }

  render() {
    const { onCompleted, toastManager } = this.props;

    return (
      <Query query={CREATE_INGREDIENTS_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <p>Error</p>;

          const { id: schoolId, ingredients, tags } = data.user.school;

          return (
            <Mutation
              mutation={CREATE_INGREDIENTS_MUTATION}
              onError={() => {
                this.setState({ mutationLoading: false });
                toastManager.add("There was an error", {
                  appearance: "error",
                  autoDismiss: true
                });
              }}
              update={() => {
                this.setState({ mutationLoading: false });
                toastManager.add("Ingredients created successfully", {
                  appearance: "success",
                  autoDismiss: true
                });

                if (onCompleted) onCompleted();
              }}
            >
              {mutation => (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    // this.props.createIngredients(this.state.ingredients)
                    const properIngredients = [];
                    let numberOfDuplicateIngredients = 0;

                    this.state.ingredients.forEach(ingredient => {
                      const { name, unit, tags } = ingredient;
                      const isDuplicate = ingredients.some(
                        i => i.name.toLowerCase() === name.toLowerCase()
                      );

                      if (isDuplicate) {
                        numberOfDuplicateIngredients++;
                      } else {
                        properIngredients.push({
                          name,
                          unit,
                          tags: tags.filter(t => t.id).map(t => t.id)
                        });
                      }
                    });

                    if (numberOfDuplicateIngredients > 0) {
                      alert("duplicate ingredients were not added");
                      // new Toast({
                      //   message: "Some duplicate ingredients were not added",
                      //   type: "warning"
                      // });
                    }

                    mutation({
                      variables: {
                        schoolId,
                        ingredients: properIngredients
                      }
                    });
                  }}
                  className="column center strict"
                >
                  <datalist id="unitList">
                    <option value="Litres" />
                    <option value="Millilitres" />
                    <option value="Gallons" />
                    <option value="Grams" />
                    <option value="Kilograms" />
                    <option value="Whole" />
                    <option value="Slices" />
                    <option value="Bags" />
                  </datalist>
                  <div className="space-around wrap">
                    {this.state.ingredients.map((i, index) => (
                      <CreateIngredientsSubForm
                        key={index}
                        index={index}
                        ingredient={i}
                        remainingTags={tags.filter(
                          t => !i.tags.some(tt => tt.id === t.id)
                        )}
                        multipleIngredients={this.state.ingredients.length > 1}
                        isDuplicate={ingredients.some(
                          ii => ii.name.toLowerCase() === i.name.toLowerCase()
                        )}
                        updateValue={this.updateValue}
                        addTag={this.addTag}
                        selectTag={e => {
                          const {
                            value,
                            dataset: { index, tagindex }
                          } = e.target;
                          const selectedTag = tags.find(t => t.id === value);
                          this.state.ingredients[index].tags[tagindex] = {
                            id: +value,
                            name: selectedTag.name
                          };
                          this.forceUpdate();
                        }}
                        removeTag={this.removeTag}
                        removeIngredientSubForm={this.removeIngredientSubForm}
                      />
                    ))}
                  </div>
                  <div
                    className="space-around"
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      width: "100%"
                    }}
                  >
                    <span />
                    <input
                      type="submit"
                      value="Add Ingredients"
                      className="info"
                    />
                    <button
                      type="button"
                      id="CreateIngredientsAddButton"
                      name=""
                      style={{ padding: "5px 12px" }}
                      onClick={this.addIngredientSubForm}
                    >
                      +
                    </button>
                  </div>
                </form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }

  addIngredientSubForm = () => {
    this.state.ingredients.push({
      name: "",
      unit: "",
      tags: []
    });
    this.forceUpdate();
  };

  removeIngredientSubForm = (index = 0) => {
    if (this.state.ingredients.length > 1) {
      this.state.ingredients.splice(index, 1);
      this.forceUpdate();
    }
  };

  updateValue = e => {
    const {
      value,
      dataset: { index, name }
    } = e.target;
    this.state.ingredients[index][name] = value;
    this.forceUpdate();
  };

  addTag = e => {
    const {
      dataset: { index }
    } = e.target;
    // null id is indicator that this is yet to be selected
    this.state.ingredients[index].tags.push({ id: null });
    this.forceUpdate();
  };

  // selectTag = e => {
  //   const {
  //     value,
  //     dataset: { index, tagindex }
  //   } = e.target;
  //   const selectedTag = tags.find(t => t.id === value);
  //   this.state.ingredients[index].tags[tagindex] = {
  //     id: +value,
  //     name: selectedTag.name
  //   };
  //   this.forceUpdate();
  // };

  removeTag = e => {
    const {
      dataset: { index, tagindex }
    } = e.target;
    this.state.ingredients[index].tags.splice(tagindex, 1);
    this.forceUpdate();
  };

  // submitIngredients = e => {
  //   e.preventDefault();
  //   // this.props.createIngredients(this.state.ingredients)
  //   const
  //   const properIngredients = [];
  //   let numberOfDuplicateIngredients = 0;

  //   this.state.ingredients.forEach(ingredient => {
  //     const { name, unit, tags } = ingredient;
  //     const isDuplicate = ingredients.some(
  //       i => i.name.toLowerCase() === name.toLowerCase()
  //     );

  //     if (isDuplicate) {
  //       numberOfDuplicateIngredients++;
  //     } else {
  //       properIngredients.push({
  //         name,
  //         unit,
  //         schoolName: "user.schoolName",
  //         tags: tags.filter(t => t.id).map(t => t.id)
  //       });
  //     }
  //   });

  //   if (numberOfDuplicateIngredients > 0) {
  //     alert("duplicate ingredients were not added");
  //     // new Toast({
  //     //   message: "Some duplicate ingredients were not added",
  //     //   type: "warning"
  //     // });
  //   }

  //   console.log("properIngredients", properIngredients);
  // };
}

export default withToastManager(CreateIngredients);

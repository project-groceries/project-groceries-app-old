import React, { Component, Fragment } from "react";
import TextToggle from "./TextToggle";
import { css } from "emotion";
import { Query } from "react-apollo";
import { ORDER_CAROUSEL_QUERY } from "../queries";
import Spinner from "./Spinner";
import Select from "react-select";
import Button from "@atlaskit/button";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import UndrawChef from "./svg/UndrawChef";
import CreateRecipe from "./CreateRecipe";
import CreateIngredients from "./CreateIngredients";
import OrderIngredient from "./OrderIngredient";
import OrderRecipe from "./OrderRecipe";

class OrderCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRecipe: true,
      currentClass: null,
      isCreateRecipeModalOpen: false,
      isCreateIngredientModalOpen: false
    };
  }

  render() {
    const { onCompleted } = this.props;

    const {
      isRecipe,
      currentClass,
      isCreateRecipeModalOpen,
      isCreateIngredientModalOpen
    } = this.state;

    return (
      <div
        className={css`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          // justify-content: center;
          // align-items: center;

          overflow: hidden;

          & > div:last-child {
            flex: 1;

            display: grid;
            grid-template-columns: 1fr 1fr;
            // grid-auto-rows: 100%;
            // grid-gap: 10px;
            // max-width: 1000px;
            width: 200%;
            // margin: 10px auto;

            transition: all 0.3s ease;

            overflow: auto;
          }

          & > div:last-child[data-recipe="true"] {
            transform: translateX(-50%);
          }

          & > div:last-child > div {
            padding: 10px;
            text-align: center;
            // display: flex;
            // justify-content: center;
            // align-items: center;

            & > * {
              margin-top: 10px;
            }
          }
        `}
      >
        <TextToggle
          id="orderCarouselToggle"
          checked={isRecipe}
          checkedText="Recipe"
          uncheckedText="Custom"
          onChange={() =>
            this.setState(prevProps => ({ isRecipe: !prevProps.isRecipe }))
          }
        />
        <div data-recipe={isRecipe}>
          <Query query={ORDER_CAROUSEL_QUERY}>
            {({ loading, error, data }) => {
              if (loading)
                return (
                  <Fragment>
                    <div>
                      <Spinner />
                    </div>
                    <div>
                      <Spinner />
                    </div>
                  </Fragment>
                );

              if (error) return <div>Error</div>;

              const { classes, recipes } = data;

              return (
                <Fragment>
                  <div>
                    <ModalTransition>
                      {isCreateIngredientModalOpen && (
                        <Modal
                          actions={[
                            {
                              text: "Close",
                              onClick: () =>
                                this.setState({
                                  isCreateIngredientModalOpen: false
                                })
                            }
                          ]}
                          onClose={() =>
                            this.setState({
                              isCreateIngredientModalOpen: false
                            })
                          }
                          heading="Create Ingredients"
                        >
                          <CreateIngredients
                            onCompleted={() =>
                              this.setState({
                                isCreateIngredientModalOpen: false
                              })
                            }
                          />
                        </Modal>
                      )}
                    </ModalTransition>
                    <Select
                      className="radio-select"
                      classNamePrefix="react-select"
                      isSearchable={false}
                      value={currentClass}
                      options={classes.map(c => ({
                        label: c.name,
                        value: c.id
                      }))}
                      placeholder="Select a class to place the orders in"
                      onChange={data => {
                        if (data.value) {
                          this.setState({
                            currentClass: data
                          });
                        }
                      }}
                    />
                    {currentClass && (
                      <OrderIngredient
                        currentClass={currentClass}
                        onCompleted={onCompleted}
                      />
                    )}
                    <div>
                      <Button
                        appearance="subtle"
                        onClick={() =>
                          this.setState({
                            isCreateIngredientModalOpen: true
                          })
                        }
                      >
                        Or Create Another Ingredient
                      </Button>
                    </div>
                  </div>
                  <div>
                    <ModalTransition>
                      {isCreateRecipeModalOpen && (
                        <Modal
                          actions={[
                            {
                              text: "Close",
                              onClick: () =>
                                this.setState({
                                  isCreateRecipeModalOpen: false
                                })
                            }
                          ]}
                          onClose={() =>
                            this.setState({
                              isCreateRecipeModalOpen: false
                            })
                          }
                          heading="Create A Recipe"
                        >
                          <CreateRecipe
                            onCompleted={() =>
                              this.setState({
                                isCreateRecipeModalOpen: false
                              })
                            }
                          />
                        </Modal>
                      )}
                    </ModalTransition>
                    {!recipes.length ? (
                      <div
                        className={css`
                          height: 100%;
                          width: 100%;
                          display: flex;
                          flex-direction: column;
                          justify-content: center;
                          align-items: center;
                        `}
                      >
                        <UndrawChef width="250px" />
                        <p>There are no recipes yet</p>
                        <Button
                          appearance="link"
                          onClick={() =>
                            this.setState({ isCreateRecipeModalOpen: true })
                          }
                        >
                          Create Recipe
                        </Button>
                      </div>
                    ) : (
                      <Fragment>
                        <Select
                          className="radio-select"
                          classNamePrefix="react-select"
                          isSearchable={false}
                          value={currentClass}
                          options={classes.map(c => ({
                            label: c.name,
                            value: c.id
                          }))}
                          placeholder="Select a class to place the orders in"
                          onChange={data => {
                            if (data.value) {
                              this.setState({ currentClass: data });
                            }
                          }}
                        />
                        {currentClass && (
                          <OrderRecipe
                            currentClass={currentClass}
                            onCompleted={onCompleted}
                          />
                        )}
                        <div>
                          <Button
                            appearance="subtle"
                            onClick={() =>
                              this.setState({
                                isCreateRecipeModalOpen: true
                              })
                            }
                          >
                            Or Create Another Recipe
                          </Button>
                        </div>
                      </Fragment>
                    )}
                  </div>
                </Fragment>
              );
            }}
          </Query>
        </div>
      </div>
    );
  }
}

export default OrderCarousel;

import gql from "graphql-tag";

export const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name, type: "STUDENT") {
      token
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const USER_QUERY = gql`
  query userQuery {
    user {
      id
      email
      name
      type
      createdAt
      hasDeclaredAccountType
      avatar
      school {
        id
        name
      }
    }
    classes {
      id
      name
    }
  }
`;

export const FIND_SCHOOLS_QUERY = gql`
  query findSchoolsQuery {
    schools {
      id
      name
    }
  }
`;

export const JOIN_SCHOOL_MUTATION = gql`
  mutation JoinSchoolMutation($id: String!) {
    joinSchool(id: $id) {
      id
      name
      school {
        id
        name
      }
    }
  }
`;

export const CREATE_SCHOOL_MUTATION = gql`
  mutation CreateSchoolMutation($name: String!) {
    createSchool(name: $name) {
      id
      name
      users {
        id
        hasDeclaredAccountType
        school {
          id
          name
        }
      }
    }
  }
`;

export const DECLARE_ACCOUNT_TYPE_MUTATION = gql`
  mutation DeclareAccountType($type: String!) {
    declareAccountType(type: $type) {
      id
      hasDeclaredAccountType
      type
    }
  }
`;

export const OVERVIEW_QUERY = gql`
  query overviewQuery {
    user {
      id
      type
    }
    classes {
      id
      name
    }
  }
`;

export const CLASSES_QUERY = gql`
  query overviewQuery {
    classes {
      id
      name
    }
    user {
      id
      type
    }
  }
`;

export const ENROL_QUERY = gql`
  query enrolQuery {
    user {
      id
      school {
        id
        users(where: { type: TEACHER }) {
          id
          classes {
            id
            name
          }
        }
      }
      enrolledIn {
        id
        name
      }
    }
  }
`;

export const CREATE_CLASS_QUERY = gql`
  query createClassQuery {
    user {
      id
      classes {
        id
      }
    }
  }
`;

export const CREATE_CLASS_MUTATION = gql`
  mutation CreateClassMutation($name: String!) {
    createClass(name: $name) {
      id
      name
      teacher {
        id
        school {
          id
          users(where: { type: TEACHER }) {
            id
            classes {
              id
              name
            }
          }
        }
        classes {
          id
        }
      }
      students {
        id
      }
      orders {
        id
      }
    }
  }
`;
export const ENROL_INTO_CLASS_MUTATION = gql`
  mutation enrolIntoClassMutation($id: String!) {
    enrolIntoClass(id: $id) {
      id
      name
      enrolledIn {
        id
        name
        students {
          id
          name
        }
        teacher {
          id
          name
        }
      }
    }
  }
`;

export const CLASSES_GRID_QUERY = gql`
  query classesGridQuery {
    classes {
      id
      name
      teacher {
        id
        name
      }
      students {
        id
      }
    }
    user {
      id
      type
    }
  }
`;

export const CLASS_VIEW_QUERY = gql`
  query classViewQuery {
    user {
      id
      type
    }
    allClasses {
      id
      name
      teacher {
        id
        name
      }
      students {
        id
        name
      }
    }
  }
`;

export const CLASS_VIEW_GRID_QUERY = gql`
  query classViewGridQuery(
    $ids: [ID!]
    $first: Int
    $skip: Int
    $filter: [String]
    $filteredUsers: [ID!]
    $orderBy: IngredientOrderByInput
    $summary: Boolean
  ) {
    ingredients(
      first: $first
      skip: $skip
      filter: $filter
      orderBy: $orderBy
      summary: $summary
      classIDs: $ids
      filteredUsers: $filteredUsers
    ) {
      id
      name
      unit
      tags {
        id
        name
      }
      orders(
        where: { class: { id_in: $ids }, madeBy: { id_in: $filteredUsers } }
      ) {
        id
        amount
        madeBy {
          id
          name
        }
      }
    }
    ingredientsConnection(
      filter: $filter
      summary: $summary
      filteredUsers: $filteredUsers
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const CREATE_INGREDIENTS_QUERY = gql`
  query createIngredientsQuery {
    user {
      id
      school {
        id
        name
        ingredients {
          id
          name
          unit
          tags {
            id
            name
          }
        }
        tags {
          id
          name
        }
      }
    }
  }
`;

// export const CREATE_INGREDIENTS_MUTATION = gql`
//   mutation createIngredientsMutation(
//     $schoolId: String!
//     $ingredients: [IngredientCreateWithoutSchoolInput!]!
//   ) {
//     createIngredients(schoolId: $schoolId, ingredients: $ingredients) {
//       id
//       name
//       ingredients {
//         id
//         name
//         unit
//         tags {
//           id
//           name
//         }
//         orders {
//           id
//         }
//       }
//     }
//   }
// `;

export const CREATE_INGREDIENTS_MUTATION = gql`
  mutation createIngredientsMutation(
    $ingredients: [IngredientCreateWithoutSchoolInput!]!
  ) {
    createIngredients(ingredients: $ingredients) {
      id
    }
  }
`;

export const INGREDIENTS_PAGE_QUERY = gql`
  query ingredientsPageQuery {
    user {
      id
      school {
        id
        ingredients {
          id
          name
        }
      }
    }
  }
`;

export const INGREDIENTS_GRID_QUERY = gql`
  query ingredientsGridQuery {
    user {
      id
      school {
        id
        ingredients {
          id
          name
          unit
          tags {
            id
            name
          }
          orders {
            id
            amount
          }
        }
      }
    }
  }
`;

export const CREATE_ORDER_QUERY = gql`
  query createOrderQuery {
    user {
      id
      school {
        id
        ingredients {
          id
          name
          unit
        }
      }
    }
  }
`;

export const CREATE_ORDERS_MUTATION = gql`
  mutation createOrdersMutation(
    $orders: [OrderCreateWithoutOrderSessionInput!]!
  ) {
    createOrders(orders: $orders) {
      id
    }
  }
`;

export const NEW_CLASS_SUBSCRIPTION = gql`
  subscription {
    newClass {
      node {
        id
        name
        createdAt
        updatedAt
        teacher {
          id
          classes {
            id
          }
        }
        students {
          id
          enrolledIn {
            id
          }
        }
        orders {
          id
          class {
            id
          }
        }
      }
    }
  }
`;

export const UNENROL_MUTATION = gql`
  mutation unenrolMutation($id: String!) {
    unenrol(id: $id) {
      id
      enrolledIn {
        id
      }
    }
  }
`;

export const DELETE_CLASS_MUTATION = gql`
  mutation deleteClassMutation($id: String!) {
    deleteClass(id: $id) {
      id
      classes {
        id
      }
    }
  }
`;

export const NEW_ORDERS_SUBSCRIPTION = gql`
  subscription {
    newOrders {
      node {
        id
        createdAt
        updatedAt
        orders {
          id
          amount
          createdAt
          updatedAt
          ingredient {
            id
            orders {
              id
            }
          }
          orderSession {
            id
          }
          madeBy {
            id
            orders {
              id
            }
          }
          class {
            id
            orders {
              id
            }
          }
        }
      }
    }
  }
`;

export const CREATE_RECIPE_MUTATION = gql`
  mutation createRecipeMutation(
    $name: String!
    $schoolId: String!
    $ingredients: [RecipeIngredientCreateWithoutRecipeInput!]!
  ) {
    createRecipe(name: $name, schoolId: $schoolId, ingredients: $ingredients) {
      id
      name
      createdAt
      updatedAt
      school {
        id
        recipes {
          id
        }
      }
      ingredients {
        id
        amount
        createdAt
        updatedAt
        recipe {
          id
        }
        ingredient {
          id
        }
      }
    }
  }
`;

export const ORDERS_QUERY = gql`
  query ordersQuery {
    orders {
      id
      amount
      ingredient {
        id
        name
        unit
      }
      orderSession {
        id
        createdAt
        updatedAt
      }
      madeBy {
        id
        name
      }
      class {
        id
        name
      }
    }
  }
`;

export const UPDATE_ORDER_MUTATION = gql`
  mutation updateOrderMutation($id: String!, $amount: Int!) {
    updateOrder(id: $id, amount: $amount) {
      id
      amount
      createdAt
      updatedAt
    }
  }
`;

export const ORDER_CAROUSEL_QUERY = gql`
  query orderCarouselQuery {
    classes {
      id
      name
    }
    recipes {
      id
      name
      ingredients {
        id
        amount
        ingredient {
          id
          name
        }
      }
    }
  }
`;

export const ORDER_INGREDIENT_QUERY = gql`
  query orderIngredientQuery {
    user {
      id
    }
    ingredients {
      id
      name
    }
  }
`;

export const ORDER_RECIPE_QUERY = gql`
  query orderRecipeQuery {
    user {
      id
    }
    recipes {
      id
      name
      ingredients {
        id
        amount
        ingredient {
          id
          name
        }
      }
    }
  }
`;

export const CREATE_RECIPE_QUERY = gql`
  query createRecipeQuery {
    ingredients {
      id
      name
    }
    user {
      id
      school {
        id
      }
    }
  }
`;

export const CLEAR_ORDERS_MUTATION = gql`
  mutation clearOrders($classIDs: [ID!]) {
    clearOrders(classIDs: $classIDs) {
      count
    }
  }
`;

export const DELETE_ORDERSESSION_MUTATION = gql`
  mutation deleteOrderSession($id: ID!) {
    deleteOrderSession(id: $id) {
      id
    }
  }
`;

export const DELETE_ORDER_MUTATION = gql`
  mutation deleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      id
    }
  }
`;

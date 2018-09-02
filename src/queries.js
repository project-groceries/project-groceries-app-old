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
      name
      type
      hasDeclaredAccountType
      school {
        id
        name
      }
      classes {
        id
        name
      }
      enrolledIn {
        id
        name
      }
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
  mutation CreateSchoolMutation($name: String!, $teacherCode: String!) {
    createSchool(name: $name, teacherCode: $teacherCode) {
      id
      name
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
      school {
        id
        ingredients {
          id
          name
        }
      }
      classes {
        id
        name
      }
      enrolledIn {
        id
        name
      }
      orders {
        id
        amount
        ingredient {
          id
          name
          unit
        }
      }
    }
  }
`;

export const CLASSES_QUERY = gql`
  query overviewQuery {
    user {
      id
      type
      classes {
        id
        name
      }
      enrolledIn {
        id
        name
      }
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
    user {
      id
      type
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
      enrolledIn {
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
    }
  }
`;

export const CLASS_VIEW_QUERY = gql`
  query classViewQuery($id: ID!) {
    user {
      id
      type
      enrolledIn(where: { id: $id }) {
        id
        name
      }
      classes(where: { id: $id }) {
        id
        name
      }
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

export const CREATE_INGREDIENTS_MUTATION = gql`
  mutation createIngredientsMutation(
    $schoolId: String!
    $ingredients: [IngredientCreateWithoutSchoolInput!]!
  ) {
    createIngredients(schoolId: $schoolId, ingredients: $ingredients) {
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
    }
  }
`;

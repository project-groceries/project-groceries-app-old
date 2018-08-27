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
      name
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

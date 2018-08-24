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
      school {
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
